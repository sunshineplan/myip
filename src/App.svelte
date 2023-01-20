<script lang="ts">
  import ipaddr from "ipaddr.js";
  import { onMount } from "svelte";
  import Search from "./components/Search.svelte";
  import Info from "./components/Info.svelte";
  import { fire } from "./misc";
  import type { ipdata, weather } from "./misc";

  onMount(async () => {
    await getInfo();
  });

  let api_key = "__api_key__";
  let loading = false;
  let info: ipdata = {} as ipdata;
  let weather: weather;

  const getInfo = async (query = "") => {
    info = {} as ipdata;
    loading = true;
    if (query && !ipaddr.isValid(query)) {
      const resp = await fetch(`https://dns.alidns.com/resolve?name=${query}`);
      const json = await resp.json();
      if (json.Status) {
        await fire("Error", `Failed to resolve ${query}`, "error");
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
          let message = "";
          if (typeof e === "string") message = e;
          else if (e instanceof Error) message = e.message;
          await fire("Error", message, "error");
          loading = false;
          return;
        }
        if (!query) {
          await fire("Error", "No DNS record!", "error");
          loading = false;
          return;
        }
      }
    }
    try {
      const resp = await fetch(
        `https://api.ipdata.co/${query}?api-key=${api_key}`
      );
      if (!resp.ok) {
        const err = await resp.json();
        document.title = "My IP";
        await fire("Error", err.message, "error");
      } else {
        info = await resp.json();
        document.title = "IP: " + info.ip;
      }
    } catch (e) {
      document.title = "My IP";
      let message = "";
      if (typeof e === "string") message = e;
      else if (e instanceof Error) message = e.message;
      await fire("Error", message, "error");
      return;
    }
    try {
      const resp = await fetch(
        `https://weather.sunshineplan.cc/current?q=${info.ip}`,
        { method: "post" }
      );
      if (!resp.ok) {
        const err = await resp.json();
        await fire("Error", err.message, "error");
      } else {
        const json = await resp.json();
        weather = json.current;
      }
    } catch (e) {
      let message = "";
      if (typeof e === "string") message = e;
      else if (e instanceof Error) message = e.message;
      await fire("Error", message, "error");
    }
    loading = false;
  };
</script>

<main>
  <header class="navbar navbar-expand flex-column flex-md-row">
    <a class="navbar-brand text-primary m-0 mr-md-3" href="/">My IP</a>
    <a
      class="linkback"
      href="https://www.weatherapi.com"
      title="Free Weather API"
    >
      <img
        src="https://cdn.weatherapi.com/v4/images/weatherapi_logo.png"
        alt="Weather data by WeatherAPI.com"
      />
    </a>
  </header>
  <Search on:fetch={async (e) => await getInfo(e.detail.query)} />
  <Info {info} {weather} {loading} />
</main>

<style>
  :global(.swal) {
    margin: 8px 6px;
  }

  .navbar {
    user-select: none;
    height: 80px;
    justify-content: space-between;
    letter-spacing: 0.3px;
    border-bottom: 5px solid #f2f2f2;
    padding: 0.5rem 1rem;
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

    .linkback {
      display: none;
    }
  }
</style>
