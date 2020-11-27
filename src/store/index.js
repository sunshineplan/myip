import { createStore } from 'vuex'
import ipaddr from 'ipaddr.js'
import Swal from 'sweetalert2'
import { BootstrapButtons } from '@/misc.js'

export default createStore({
  state() {
    return {
      api: document.getElementById('app').dataset.api,
      online: false,
      query: '',
      info: {},
      loading: false
    }
  },
  mutations: {
    online(state) { state.online = !state.online },
    query(state, query) { state.query = query },
    info(state, info) { state.info = info },
    loading(state) { state.loading = !state.loading }
  },
  actions: {
    async info({ commit, state }, payload) {
      var api = 'https://api.ipdata.co/{ip}?api-key=' + state.api, url
      if (state.online) url = '/query?ip=' + payload.ip
      else if (payload.ip == '' || ipaddr.isValid(payload.ip))
        url = api.replace('{ip}', payload.ip)
      else {
        console.log('Host must be searched on server side.')
        url = '/query?ip=' + payload.ip
      }
      commit('info', {})
      commit('loading')
      try {
        const resp = await fetch(url)
        if (!resp.ok) {
          const err = await resp.json()
          document.title = 'My IP'
          try {
            BootstrapButtons.fire('Error', err.message, 'error')
          } catch (e) {
            BootstrapButtons.fire('Error', 'Unknown error!', 'error')
          }
        } else {
          commit('info', await resp.json())
          document.title = 'IP: ' + state.info.ip
        }
      } catch (e) {
        document.title = 'My IP'
        BootstrapButtons.fire('Error', e.message, 'error')
      }
      commit('loading')
    },
    async switcher({ commit, dispatch, state }) {
      if (state.online) {
        const confirm = await Swal.fire({
          title: 'Warning!',
          text:
            'It is recommended using online version only when offline version is not working.',
          icon: 'warning',
          confirmButtonText: 'Continue',
          showCancelButton: true,
          focusCancel: true,
          customClass: {
            confirmButton: 'swal btn btn-primary',
            cancelButton: 'swal btn btn-danger',
          },
          buttonsStyling: false,
        })
        if (!confirm.value) {
          commit('online')
          return
        }
      }
      await dispatch('info', { ip: state.query })
    }
  }
})
