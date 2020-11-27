<template>
  <header class="navbar navbar-expand flex-column flex-md-row">
    <a class="navbar-brand text-primary m-0 mr-md-3" href="/">My IP</a>
    <div class="custom-control custom-switch">
      <input
        type="checkbox"
        class="custom-control-input"
        id="online"
        v-model="online"
        @change="switcher"
      />
      <label class="custom-control-label" for="online">Online Version</label>
    </div>
  </header>
  <Search ref="search" />
  <Info :geo="geo" :loading="loading" />
</template>

<script>
import Swal from "sweetalert2";
import Search from "@/components/Search.vue";
import Info from "@/components/Info.vue";
import { BootstrapButtons } from "@/misc.js";

export default {
  name: "App",
  components: { Search, Info },
  data() {
    return {
      geo: {},
      loading: false,
      online: false,
      api: document.getElementById("app").dataset.api,
    };
  },
  async created() {
    await this.get();
  },
  methods: {
    async switcher() {
      if (this.online) {
        const confirm = await Swal.fire({
          title: "Warning!",
          text:
            "It is recommended using online version only when offline version is not working.",
          icon: "warning",
          confirmButtonText: "Continue",
          showCancelButton: true,
          focusCancel: true,
          customClass: {
            confirmButton: "swal btn btn-primary",
            cancelButton: "swal btn btn-danger",
          },
          buttonsStyling: false,
        });
        if (!confirm.value) {
          this.online = false;
          return;
        }
      }
      await this.get(this.$refs.search.address);
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

.swal {
  margin: 8px 6px;
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
