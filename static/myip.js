const BootstrapButtons = Swal.mixin({
  customClass: { confirmButton: 'swal btn btn-primary' },
  buttonsStyling: false
})

const app = Vue.createApp({
  data() {
    return {
      geo: {},
      loading: false,
      online: false,
      api: document.getElementById('myip').dataset.api,
    }
  },
  created() { this.get() },
  methods: {
    get: function (ip = '') {
      var api = 'https://api.ipdata.co/{ip}?api-key=' + this.api, url
      if (this.online) url = '/query?ip=' + ip;
      else if (ip == '' || ipaddr.isValid(ip)) url = api.replace('{ip}', ip);
      else {
        console.log('Host must be searched on server side.');
        url = '/query?ip=' + ip;
      };
      this.geo = {}
      this.loading = true
      fetch(url).then(resp => {
        if (!resp.ok) {
          return resp.json().then(err => {
            document.title = 'My IP';
            try {
              BootstrapButtons.fire('Error', err.message, 'error');
            } catch (e) {
              BootstrapButtons.fire('Error', 'Unknown error!', 'error');
            }
          });
        }
        return resp.json().then(json => {
          document.title = 'IP: ' + json.ip;
          this.geo = json;
        })
      }).catch(e => {
        document.title = 'My IP';
        BootstrapButtons.fire('Error', e.message, 'error');
      })
      this.loading = false;
    },
    switcher: function () {
      if (this.online)
        Swal.fire({
          title: 'Warning!',
          text: 'It is recommended using online version only when offline version is not working.',
          icon: 'warning',
          confirmButtonText: 'Continue',
          showCancelButton: true,
          focusCancel: true,
          customClass: {
            confirmButton: 'swal btn btn-primary',
            cancelButton: 'swal btn btn-danger'
          },
          buttonsStyling: false
        }).then(confirm => {
          if (!confirm.value) this.online = false;
          else this.get(this.$refs.search.address);
        });
      else this.get(this.$refs.search.address);
    }
  }
})

app.component('search', {
  data() { return { address: '' } },
  template: `
<div class='input-group search'>
  <input
    class='form-control'
    placeholder='IPv4 or IPv6 or Host'
    v-model='address'
    @keyup.enter='search'>
  <div class='input-group-append'>
    <button class='btn btn-outline-primary' type='button' @click='search'>Search</button>
    <button class='btn btn-outline-danger' type='button' @click='reset'>Reset</button>
  </div>
</div>`,
  methods: {
    search: function () { this.$parent.get(this.address) },
    reset: function () {
      this.address = '';
      this.$parent.get();
    }
  }
})

app.component('geo-component', {
  props: {
    geo: Object,
    loading: Boolean
  },
  template: `
<table>
  <tbody>
    <tr>
      <td>IP:</td>
      <td><div :class='{ loading: loading }'>{{ loading ? '' : geo.ip ? geo.ip : 'N/A' }}</div></td>
    </tr>
    <tr>
      <td>Country:</td>
      <td>
        <div :class='{ loading: loading }'>{{ loading ? '' : geo.country_name ? geo.country_name : 'N/A' }}</div>
        <img class='flag' v-if='geo.flag' :src='geo.flag'>
      </td>
    </tr>
    <tr>
      <td>Region:</td>
      <td><div :class='{ loading: loading }'>{{ loading ? '' : geo.region ? geo.region : 'N/A' }}</div></td>
    </tr>
    <tr>
      <td>City:</td>
      <td><div :class='{ loading: loading }'>{{ loading ? '' : geo.city ? geo.city : 'N/A' }}</div></td>
    </tr>
    <tr>
      <td>Zip:</td>
      <td><div :class='{ loading: loading }'>{{ loading ? '' : geo.postal ? geo.postal : 'N/A' }}</div></td>
    </tr>
    <tr>
      <td>ISP:</td>
      <td><div :class='{ loading: loading }'>{{ loading ? '' : geo.asn ? geo.asn.name : 'N/A' }}</div></td>
    </tr>
    <tr>
      <td>Org:</td>
      <td><div :class='{ loading: loading }'>{{ loading ? '' : geo.carrier ? geo.carrier.name : 'N/A' }}</div></td>
    </tr>
    <tr>
      <td>Timezone:</td>
      <td><div :class='{ loading: loading }'>{{ loading ? '' : geo.time_zone ? geo.time_zone.name : 'N/A' }}</div></td>
    </tr>
    <tr>
      <td>Localtime:</td>
      <td><div :class='{ loading: loading }'>{{ loading ? '' : localtime }}</div></td>
    </tr>
    <tr>
      <td>Platform:</td>
      <td><div :class='{ loading: loading }'>{{ loading ? '' : platform }}</div></td>
    </tr>
    <tr>
      <td>UserAgent:</td>
      <td><div :class='{ loading: loading }'>{{ loading ? '' : useragent }}</div></td>
    </tr>
  </tbody>
</table>`,
  data() {
    return {
      localtime: new Date().toString().split('(')[0].trim(),
      platform: navigator.platform,
      useragent: navigator.userAgent
    }
  }
})

app.mount('#myip')
