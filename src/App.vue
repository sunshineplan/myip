<template>
  <header class="navbar navbar-expand flex-column flex-md-row">
    <a class="navbar-brand text-primary m-0 mr-md-3" href="/">My IP</a>
    <div class="custom-control custom-switch">
      <input
        type="checkbox"
        class="custom-control-input"
        id="online"
        v-model="online"
        @change="switcher()"
      />
      <label class="custom-control-label" for="online">Online Version</label>
    </div>
  </header>
  <Search />
  <Info />
</template>

<script>
import Search from "@/components/Search.vue";
import Info from "@/components/Info.vue";

export default {
  name: "App",
  components: { Search, Info },
  computed: {
    online: {
      get() {
        return this.$store.state.online;
      },
      set() {
        this.$store.commit("online");
      },
    },
  },
  async created() {
    await this.$store.dispatch("info", { ip: "" });
  },
  methods: {
    async switcher() {
      await this.$store.dispatch("switcher");
    },
  },
};
</script>

<style scoped>
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

<style>
.swal {
  margin: 8px 6px;
}
</style>
