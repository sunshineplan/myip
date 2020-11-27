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
import ipaddr from "ipaddr.js";
import Search from "@/components/Search.vue";
import Info from "@/components/Info.vue";

const BootstrapButtons = Swal.mixin({
  customClass: { confirmButton: "swal btn btn-primary" },
  buttonsStyling: false,
});

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
  created() {
    this.get();
  },
  methods: {
    get(ip = "") {
      var api = "https://api.ipdata.co/{ip}?api-key=" + this.api,
        url;
      if (this.online) url = "/query?ip=" + ip;
      else if (ip == "" || ipaddr.isValid(ip)) url = api.replace("{ip}", ip);
      else {
        console.log("Host must be searched on server side.");
        url = "/query?ip=" + ip;
      }
      this.geo = {};
      this.loading = true;
      fetch(url)
        .then((resp) => {
          if (!resp.ok) {
            return resp.json().then((err) => {
              document.title = "My IP";
              try {
                BootstrapButtons.fire("Error", err.message, "error");
              } catch (e) {
                BootstrapButtons.fire("Error", "Unknown error!", "error");
              }
            });
          }
          return resp.json().then((json) => {
            document.title = "IP: " + json.ip;
            this.geo = json;
          });
        })
        .catch((e) => {
          document.title = "My IP";
          BootstrapButtons.fire("Error", e.message, "error");
        });
      this.loading = false;
    },
    switcher() {
      if (this.online)
        Swal.fire({
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
        }).then((confirm) => {
          if (!confirm.value) this.online = false;
          else this.get(this.$refs.search.address);
        });
      else this.get(this.$refs.search.address);
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
