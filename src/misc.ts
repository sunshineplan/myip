import Swal from 'sweetalert2'

export interface ipdata {
  ip: string
  country_name: string
  flag: string
  region: string | null
  city: string | null
  postal: string | null
  asn: { name: string } | undefined
  carrier: { name: string } | undefined
  time_zone: { name: string }
}

export interface weather {
  temp_c: number
  feelslike_c: number
  humidity: number
  precip_mm: number
  vis_km: number
  cloud: number
  wind_kph: number
  wind_degree: number
  wind_dir: string
  gust_kph: string
  pressure_mb: number
  uv: number
  condition: {
    text: string
    icon: string
  }
}

export const fire = async (
  title?: string | undefined,
  html?: string | undefined,
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question' | undefined
) => {
  return Swal.mixin({
    customClass: { confirmButton: 'swal btn btn-primary' },
    buttonsStyling: false,
  }).fire(title, html, icon)
}
