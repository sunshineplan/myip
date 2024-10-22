interface IPData {
  ip: string
  country_name?: string
  flag?: string
  region?: string | null
  city?: string | null
  postal?: string | null
  asn?: { name: string }
  carrier?: { name: string }
  time_zone?: { name: string }
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
