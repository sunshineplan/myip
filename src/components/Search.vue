<template>
  <div class="input-group search">
    <input
      class="form-control"
      placeholder="IPv4 or IPv6 or Host"
      v-model="address"
      @keyup.enter="search"
    />
    <div class="input-group-append">
      <button class="btn btn-outline-primary" type="button" @click="search">
        Search
      </button>
      <button class="btn btn-outline-danger" type="button" @click="reset">
        Reset
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Search",
  methods: {
    search: function () {
      this.$parent.get(this.address);
    },
    reset: function () {
      this.address = "";
      this.$parent.get();
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
