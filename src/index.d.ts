interface IPInfo {
  ip: string
  location?: {
    country: string
    country_code: string
    state?: string
    city?: string
    timezone: string
  }
  isp?: {
    isp: string
  }
}

interface Weather {
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
