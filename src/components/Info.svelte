<script lang="ts">
  import { onMount } from "svelte";
  import type { ipdata, weather } from "../misc";

  const useragent = navigator.userAgent;

  export let info: ipdata;
  export let weather: weather;
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
      <td class="info">
        <div class:loading>{loading ? "" : info.ip ? info.ip : "N/A"}</div>
      </td>
    </tr>
    <tr>
      <td>Country:</td>
      <td class="info">
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
      <td class="info">
        <div class:loading>
          {loading ? "" : info.region ? info.region : "N/A"}
        </div>
      </td>
    </tr>
    <tr>
      <td>City:</td>
      <td class="info">
        <div class:loading>{loading ? "" : info.city ? info.city : "N/A"}</div>
      </td>
    </tr>
    <tr>
      <td>ISP:</td>
      <td class="info">
        <div class:loading>
          {loading ? "" : info.asn ? info.asn.name : "N/A"}
        </div>
      </td>
    </tr>
    <tr>
      <td>Timezone:</td>
      <td class="info">
        <div class:loading>
          {loading
            ? ""
            : info.time_zone
            ? info.time_zone.name
              ? info.time_zone.name
              : "N/A"
            : "N/A"}
        </div>
      </td>
    </tr>
    <tr>
      <td>Localtime:</td>
      <td class="info">
        <div class:loading>{loading ? "" : localtime}</div>
      </td>
    </tr>
    <tr>
      <td>UserAgent:</td>
      <td class="info">
        <div class:loading>{loading ? "" : useragent}</div>
      </td>
    </tr>
    <tr>
      <td>Weather:</td>
      <td class:info={!weather}>
        <div class:loading>
          {#if loading}{:else if weather}
            <div style="display:flex">
              <img alt={weather.condition.text} src={weather.condition.icon} />
              <span style="font-size:40px">{weather.temp_c}</span>
            </div>
            <div style="font-weight:700">
              {weather.condition.text}, Feels like {weather.feelslike_c}
            </div>
            <ul class="weather-items">
              <li>
                <svg
                  viewBox="0 0 1000 1000"
                  enable-background="new 0 0 1000 1000"
                  xml:space="preserve"
                  style="transform:rotate({180 +
                    weather.wind_degree}deg);height:8pt"
                >
                  <g fill="#48484a">
                    <path
                      d="M510.5,749.6c-14.9-9.9-38.1-9.9-53.1,1.7l-262,207.3c-14.9,11.6-21.6,6.6-14.9-11.6L474,48.1c5-16.6,14.9-18.2,21.6,0l325,898.7c6.6,16.6-1.7,23.2-14.9,11.6L510.5,749.6z"
                    />
                    <path
                      d="M817.2,990c-8.3,0-16.6-3.3-26.5-9.9L497.2,769.5c-5-3.3-18.2-3.3-23.2,0L210.3,976.7c-19.9,16.6-41.5,14.9-51.4,0c-6.6-9.9-8.3-21.6-3.3-38.1L449.1,39.8C459,13.3,477.3,10,483.9,10c6.6,0,24.9,3.3,34.8,29.8l325,898.7c5,14.9,5,28.2-1.7,38.1C837.1,985,827.2,990,817.2,990z M485.6,716.4c14.9,0,28.2,5,39.8,11.6l255.4,182.4L485.6,92.9l-267,814.2l223.9-177.4C454.1,721.4,469,716.4,485.6,716.4z"
                    />
                  </g>
                </svg>
                {weather.wind_kph} {weather.wind_dir}
              </li>
              <li>
                <svg
                  width="96pt"
                  height="96pt"
                  viewBox="0 0 96 96"
                  style="height:12pt;width:auto"
                >
                  <g
                    transform="translate(0,96) scale(0.100000,-0.100000)"
                    fill="#48484a"
                    stroke="none"
                  >
                    <path
                      d="M351 854 c-98 -35 -179 -108 -227 -202 -27 -53 -29 -65 -29 -172 0
            -107 2 -119 29 -172 38 -75 104 -141 180 -181 58 -31 66 -32 176 -32 110 0
            118 1 175 32 77 40 138 101 178 178 31 57 32 65 32 175 0 110 -1 118 -32 176
            -40 76 -106 142 -181 179 -49 25 -71 29 -157 32 -73 2 -112 -1 -144 -13z m259
            -80 c73 -34 126 -86 161 -159 24 -50 29 -73 29 -135 0 -62 -5 -85 -29 -135
            -57 -119 -161 -185 -291 -185 -130 0 -234 66 -291 185 -24 50 -29 73 -29 135
            0 130 66 234 185 291 82 40 184 41 265 3z"
                    />
                    <path
                      d="M545 600 c-35 -35 -68 -60 -80 -60 -27 0 -45 -18 -45 -45 0 -33 -50
            -75 -89 -75 -18 0 -41 -5 -53 -11 -20 -11 -20 -11 3 -35 12 -13 33 -24 46 -24
            17 0 23 -6 23 -23 0 -13 10 -33 23 -45 30 -28 47 -13 47 43 0 32 6 47 28 68
            15 15 37 27 48 27 26 0 44 18 44 44 0 12 26 47 60 81 l60 61 -28 27 -28 27
            -59 -60z"
                    />
                  </g>
                </svg>
                {weather.pressure_mb}hPa
              </li>
              <li>
                <span class="symbol">Humidity:</span>{weather.humidity}%
              </li>
              <li>
                <span class="symbol">Cloud:</span>{weather.cloud}%
              </li>
              <li>
                <span class="symbol">Visibility:</span>{weather.vis_km}km
              </li>
              <li>
                <span class="symbol">UV:</span>{weather.uv}
              </li>
              <li>
                <span class="symbol">Precipitation:</span>
                {weather.precip_mm ? weather.precip_mm : 0}mm
              </li>
            </ul>
          {:else}
            N/A
          {/if}
        </div>
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

  td > div {
    display: inline-block;
    border: 1px solid #cbcbcb;
    background: #f2f2f2;
    padding: 6px;
  }

  td.info > div {
    font-size: 1.25em;
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
    font-size: 0.5em !important;
    background-color: transparent;
  }

  .weather-items {
    list-style: none;
    max-width: 275px;
    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    margin-bottom: 0;
  }

  .weather-items li {
    margin-right: 16pt;
    display: flex;
    align-items: center;
  }

  .symbol {
    margin-right: 4pt;
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

    td:first-child,
    td div {
      font-size: 1em;
    }

    .loading {
      border-width: 0.25em;
    }
  }
</style>
