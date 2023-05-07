export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      properties: {
        Row: {
          agent_email: string | null
          agent_phone: string | null
          agent_website: string | null
          cladding_cert: boolean | null
          created_at: string
          electrics_cert: boolean | null
          energy_effeciency: number | null
          est_month_rent: number | null
          floor_level: number | null
          garden_balcony: boolean | null
          house_price: number | null
          id: number
          interior: Database["public"]["Enums"]["quality_assessment_enum"]
          lease_length: number | null
          local_gym: boolean | null
          local_supermarket: boolean | null
          notes: string | null
          sc_gr_annual: number | null
          sq_metres: number | null
          url_link: string | null
          user_id: string | null
          view: Database["public"]["Enums"]["quality_assessment_enum"]
          walk_to_station: number | null
        }
        Insert: {
          agent_email?: string | null
          agent_phone?: string | null
          agent_website?: string | null
          cladding_cert?: boolean | null
          created_at?: string
          electrics_cert?: boolean | null
          energy_effeciency?: number | null
          est_month_rent?: number | null
          floor_level?: number | null
          garden_balcony?: boolean | null
          house_price?: number | null
          id?: number
          interior?: Database["public"]["Enums"]["quality_assessment_enum"]
          lease_length?: number | null
          local_gym?: boolean | null
          local_supermarket?: boolean | null
          notes?: string | null
          sc_gr_annual?: number | null
          sq_metres?: number | null
          url_link?: string | null
          user_id?: string | null
          view?: Database["public"]["Enums"]["quality_assessment_enum"]
          walk_to_station?: number | null
        }
        Update: {
          agent_email?: string | null
          agent_phone?: string | null
          agent_website?: string | null
          cladding_cert?: boolean | null
          created_at?: string
          electrics_cert?: boolean | null
          energy_effeciency?: number | null
          est_month_rent?: number | null
          floor_level?: number | null
          garden_balcony?: boolean | null
          house_price?: number | null
          id?: number
          interior?: Database["public"]["Enums"]["quality_assessment_enum"]
          lease_length?: number | null
          local_gym?: boolean | null
          local_supermarket?: boolean | null
          notes?: string | null
          sc_gr_annual?: number | null
          sq_metres?: number | null
          url_link?: string | null
          user_id?: string | null
          view?: Database["public"]["Enums"]["quality_assessment_enum"]
          walk_to_station?: number | null
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
      quality_assessment_enum: "Awful" | "Bad" | "Okay" | "Good" | "Great"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
