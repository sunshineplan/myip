import Swal from 'sweetalert2'

export const BootstrapButtons = Swal.mixin({
  customClass: { confirmButton: 'swal btn btn-primary' },
  buttonsStyling: false
})
