import ipaddr from "ipaddr.js"
import { BootstrapButtons } from "@/misc.js"

export default {
  methods: {
    async get(ip = "") {
      var api = "https://api.ipdata.co/{ip}?api-key=" + this.api, url
      if (this.online) url = "/query?ip=" + ip
      else if (ip == "" || ipaddr.isValid(ip)) url = api.replace("{ip}", ip)
      else {
        console.log("Host must be searched on server side.")
        url = "/query?ip=" + ip
      }
      this.geo = {}
      this.loading = true
      try {
        const resp = await fetch(url)
        if (!resp.ok) {
          const err = await resp.json()
          document.title = "My IP"
          try {
            BootstrapButtons.fire("Error", err.message, "error")
          } catch (e) {
            BootstrapButtons.fire("Error", "Unknown error!", "error")
          }
        } else {
          this.geo = await resp.json()
          document.title = "IP: " + this.geo.ip
        }
      } catch (e) {
        document.title = "My IP"
        BootstrapButtons.fire("Error", e.message, "error")
      }
      this.loading = false
    }
  }
}
