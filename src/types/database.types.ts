export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      houses: {
        Row: {
          cladding_cert: boolean
          contacted_agent: boolean
          created_at: string | null
          electrics_cert: boolean
          energy_effeciency: number
          est_month_rent: number
          floor_level: number
          garden_balcony: boolean
          house_price: number
          id: number
          interior: number
          lease_length: number
          local_gym: boolean
          local_supermarket: boolean
          sc_gr_annual: number
          sq_metres: number
          url_link: string
          view: number
        }
        Insert: {
          cladding_cert: boolean
          contacted_agent: boolean
          created_at?: string | null
          electrics_cert: boolean
          energy_effeciency: number
          est_month_rent: number
          floor_level: number
          garden_balcony: boolean
          house_price: number
          id?: number
          interior: number
          lease_length: number
          local_gym: boolean
          local_supermarket: boolean
          sc_gr_annual: number
          sq_metres: number
          url_link: string
          view: number
        }
        Update: {
          cladding_cert?: boolean
          contacted_agent?: boolean
          created_at?: string | null
          electrics_cert?: boolean
          energy_effeciency?: number
          est_month_rent?: number
          floor_level?: number
          garden_balcony?: boolean
          house_price?: number
          id?: number
          interior?: number
          lease_length?: number
          local_gym?: boolean
          local_supermarket?: boolean
          sc_gr_annual?: number
          sq_metres?: number
          url_link?: string
          view?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
