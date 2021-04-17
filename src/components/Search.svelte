<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let query = "";

  const search = () => {
    dispatch("fetch", { query });
  };
</script>

<div class="input-group search">
  <input
    class="form-control"
    placeholder="IPv4 or IPv6 or Host"
    bind:value={query}
    on:keypress={(e) => {
      if (e.key === "Enter") search();
    }}
  />
  <div class="input-group-append">
    <button class="btn btn-outline-primary" type="button" on:click={search}>
      Search
    </button>
    <button
      class="btn btn-outline-danger"
      type="button"
      on:click={() => {
        query = "";
        search();
      }}
    >
      Reset
    </button>
  </div>
</div>

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
