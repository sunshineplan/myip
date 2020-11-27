<template>
  <div class="input-group search">
    <input
      class="form-control"
      placeholder="IPv4 or IPv6 or Host"
      v-model="query"
      @keyup.enter="search()"
    />
    <div class="input-group-append">
      <button class="btn btn-outline-primary" type="button" @click="search()">
        Search
      </button>
      <button class="btn btn-outline-danger" type="button" @click="reset()">
        Reset
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Search",
  computed: {
    query: {
      get() {
        return this.$store.state.query;
      },
      set(value) {
        this.$store.commit("query", value);
      },
    },
  },
  methods: {
    async search() {
      await this.$store.dispatch("info", { ip: this.query });
    },
    async reset() {
      this.$store.commit("query", "");
      await this.$store.dispatch("info", { ip: "" });
    },
  },
};
</script>

<style scoped>
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
