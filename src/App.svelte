<script lang="ts">
  import ipaddr from "ipaddr.js";
  import Swal from "sweetalert2";
  import { onMount } from "svelte";
  import Search from "./components/Search.svelte";
  import Info from "./components/Info.svelte";

  onMount(
    async (): Promise<void> => {
      await getInfo();
    }
  );

  let api = "__api__";
  let loading = false;
  let info: { [key: string]: any } = {};
  let query = "";

  const BootstrapButtons = Swal.mixin({
    customClass: { confirmButton: "swal btn btn-primary" },
    buttonsStyling: false,
  });

  async function getInfo(): Promise<void> {
    info = {};
    loading = true;
    if (query && !ipaddr.isValid(query)) {
      const resp = await fetch(`https://1.1.1.1/dns-query?name=${query}`, {
        headers: { "Content-Type": "application/dns-json" },
      });
      const json = await resp.json();
      console.log(json);
      console.log(query);
    }
    const url = `https://api.ipdata.co/${query}?api-key=${api}`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        const err = await resp.json();
        document.title = "My IP";
        try {
          BootstrapButtons.fire("Error", err.message, "error");
        } catch (e) {
          BootstrapButtons.fire("Error", "Unknown error!", "error");
        }
      } else {
        info = await resp.json();
        document.title = "IP: " + info.ip;
      }
    } catch (e) {
      document.title = "My IP";
      BootstrapButtons.fire("Error", e.message, "error");
    }
    loading = false;
  }

  function handleFetch(event: CustomEvent) {
    query = event.detail.query;
    getInfo();
  }
</script>

<style>
  .navbar {
    user-select: none;
    height: 80px;
    justify-content: space-between;
    letter-spacing: 0.3px;
    border-bottom: 5px solid #f2f2f2;
  }

  .navbar-brand {
    font-size: 24px;
    padding-left: 30px;
  }

  @media (max-width: 767px) {
    .navbar {
      border-color: transparent;
    }

    .navbar-brand {
      padding-left: 0;
    }
  }
</style>

<main>
  <header class="navbar navbar-expand flex-column flex-md-row">
    <a class="navbar-brand text-primary m-0 mr-md-3" href="/">My IP</a>
  </header>
  <Search {query} on:fetch={handleFetch} />
  <Info {info} {loading} />
</main>
