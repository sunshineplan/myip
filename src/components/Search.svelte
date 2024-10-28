<script lang="ts">
  let {
    getInfo,
  }: {
    getInfo: (query?: string) => Promise<void>;
  } = $props();

  let query = $state("");

  const search = async () => {
    await getInfo(query);
  };
</script>

<div class="input-group search">
  <input
    class="form-control"
    placeholder="IPv4 or IPv6 or Host"
    bind:value={query}
    onkeypress={async (e) => {
      if (e.key === "Enter") await search();
    }}
  />
  <button class="btn btn-outline-primary" type="button" onclick={search}>
    Search
  </button>
  <button
    class="btn btn-outline-danger"
    type="button"
    onclick={async () => {
      query = "";
      await search();
    }}
  >
    Reset
  </button>
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
      margin: auto;
    }
  }
</style>
