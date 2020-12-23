<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let query: string;

  function search(): void {
    dispatch("fetch", { query });
  }

  function onKeyPress(e: KeyboardEvent): void {
    if (e.key === "Enter") search();
  }

  function reset(): void {
    query = "";
    search();
  }
</script>

<style>
  .search {
    display: flex;
    position: absolute;
    right: 25px;
    top: 100px;
    width: auto;
    border-radius: 9999px;
  }

  @media (max-width: 767px) {
    .search {
      position: relative;
      top: 0;
      right: 0;
      width: 80%;
      padding-top: 1em;
      margin: auto;
    }
  }
</style>

<div class="input-group search">
  <input
    class="form-control"
    placeholder="IPv4 or IPv6 or Host"
    bind:value={query}
    on:keypress={onKeyPress} />
  <div class="input-group-append">
    <button class="btn btn-outline-primary" type="button" on:click={search}>
      Search
    </button>
    <button class="btn btn-outline-danger" type="button" on:click={reset}>
      Reset
    </button>
  </div>
</div>
