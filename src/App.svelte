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

  const BootstrapButtons = Swal.mixin({
    customClass: { confirmButton: "swal btn btn-primary" },
    buttonsStyling: false,
  });

  async function getInfo(query = ""): Promise<void> {
    info = {};
    loading = true;
    if (query && !ipaddr.isValid(query)) {
      const resp = await fetch(`http://dns.alidns.com/resolve?name=${query}`);
      const json = await resp.json();
      if (json.Status) {
        await BootstrapButtons.fire("Error", `Failed to resolve ${query}`, "error");
        loading = false;
        return;
      } else {
        try {
          for (let i = 0; i < json.Answer.length; i++) {
            if (json.Answer[i].type === 1) {
              query = json.Answer[i].data;
              break;
            }
          }
        } catch (e) {
          await BootstrapButtons.fire("Error", e.message, "error");
          loading = false;
          return;
        }
        if (!query) {
          await BootstrapButtons.fire("Error", "No DNS record!", "error");
          loading = false;
          return;
        }
      }
    }
    const url = `https://api.ipdata.co/${query}?api-key=${api}`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        const err = await resp.json();
        document.title = "My IP";
        await BootstrapButtons.fire("Error", err.message, "error");
      } else {
        info = await resp.json();
        document.title = "IP: " + info.ip;
      }
    } catch (e) {
      document.title = "My IP";
      await BootstrapButtons.fire("Error", e.message, "error");
    }
    loading = false;
  }

  function handleFetch(event: CustomEvent) {
    getInfo(event.detail.query);
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
  <Search on:fetch={handleFetch} />
  <Info {info} {loading} />
</main>
