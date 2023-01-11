<script lang="ts">
  import { onMount } from "svelte";
  import type { ipdata } from "../misc";

  const platform = navigator.platform;
  const useragent = navigator.userAgent;

  export let info: ipdata;
  export let loading: boolean;

  let localtime = new Date().toString().split("(")[0].trim();

  const getMap = async (ip: string) => {
    const resp = await fetch("https://ipinfo.io/map", {
      method: "post",
      body: new URLSearchParams(`ips=${ip}`),
    });
    const json = await resp.json();
    return json.reportUrl ? (json.reportUrl as string) : "";
  };

  onMount(() => {
    setInterval(
      () => (localtime = new Date().toString().split("(")[0].trim()),
      1000
    );
  });
</script>

<table>
  <tbody>
    <tr>
      <td>IP:</td>
      <td>
        <div class:loading>{loading ? "" : info.ip ? info.ip : "N/A"}</div>
      </td>
    </tr>
    <tr>
      <td>Country:</td>
      <td>
        <div class:loading>
          {loading ? "" : info.country_name ? info.country_name : "N/A"}
        </div>
        {#if info.flag}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <img
            class="flag"
            alt={info.country_name}
            src={info.flag}
            on:click={async () => window.open(await getMap(info.ip))}
          />
        {/if}
      </td>
    </tr>
    <tr>
      <td>Region:</td>
      <td>
        <div class:loading>
          {loading ? "" : info.region ? info.region : "N/A"}
        </div>
      </td>
    </tr>
    <tr>
      <td>City:</td>
      <td>
        <div class:loading>{loading ? "" : info.city ? info.city : "N/A"}</div>
      </td>
    </tr>
    <tr>
      <td>ISP:</td>
      <td>
        <div class:loading>
          {loading ? "" : info.asn ? info.asn.name : "N/A"}
        </div>
      </td>
    </tr>
    <tr>
      <td>Timezone:</td>
      <td>
        <div class:loading>
          {loading ? "" : info.time_zone ? info.time_zone.name : "N/A"}
        </div>
      </td>
    </tr>
    <tr>
      <td>Localtime:</td>
      <td>
        <div class:loading>{loading ? "" : localtime}</div>
      </td>
    </tr>
    <tr>
      <td>Platform:</td>
      <td>
        <div class:loading>{loading ? "" : platform}</div>
      </td>
    </tr>
    <tr>
      <td>UserAgent:</td>
      <td>
        <div class:loading>{loading ? "" : useragent}</div>
      </td>
    </tr>
  </tbody>
</table>

<style>
  table {
    margin: 25px;
  }

  tr {
    height: 50px;
  }

  td:first-child {
    font-size: 1.25em;
    white-space: nowrap;
  }

  td div {
    display: inline-block;
    border: 1px solid #cbcbcb;
    background: #f2f2f2;
    font-size: 1.25em;
    padding: 6px;
  }

  .flag {
    margin-left: 8px;
    vertical-align: text-bottom;
    box-shadow: 2px 2px 4px 2px #ccc;
    cursor: pointer;
  }

  .loading {
    width: 1em;
    height: 1em;
    vertical-align: text-bottom;
    border: 0.5em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
    font-size: 0.5em;
    background-color: transparent;
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 767px) {
    table {
      margin: 10px;
    }

    tr {
      height: 40px;
    }

    /*tr:nth-last-of-type(1), tr:nth-last-of-type(2) {
        display: none;
    }*/

    td:first-child,
    td div {
      font-size: 1em;
    }

    .loading {
      border-width: 0.25em;
    }
  }
</style>
