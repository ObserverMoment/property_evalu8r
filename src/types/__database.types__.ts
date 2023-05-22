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
      project_members: {
        Row: {
          created_at: string | null
          id: number
          project_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          project_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          project_id?: number
          user_id?: string
        }
      }
      projects: {
        Row: {
          created_at: string | null
          id: number
          name: string
          password: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          password: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          password?: string
        }
      }
      properties: {
        Row: {
          agent_email: string | null
          agent_phone: string | null
          agent_website: string | null
          created_at: string
          energy_effeciency: number | null
          floor_level: number | null
          garden_balcony: boolean | null
          house_price: number | null
          id: number
          interior: Database["public"]["Enums"]["quality_assessment_enum"]
          lease_length: number | null
          listing_title: string | null
          local_gym: boolean | null
          local_supermarket: boolean | null
          notes: string | null
          off_street_parking: boolean | null
          offered: number | null
          project_id: number
          sc_gr_annual: number | null
          sq_metres: number | null
          url_link: string | null
          user_id: string | null
          view: Database["public"]["Enums"]["quality_assessment_enum"]
          view_date: string | null
          walk_to_park: number | null
          walk_to_station: number | null
        }
        Insert: {
          agent_email?: string | null
          agent_phone?: string | null
          agent_website?: string | null
          created_at?: string
          energy_effeciency?: number | null
          floor_level?: number | null
          garden_balcony?: boolean | null
          house_price?: number | null
          id?: number
          interior?: Database["public"]["Enums"]["quality_assessment_enum"]
          lease_length?: number | null
          listing_title?: string | null
          local_gym?: boolean | null
          local_supermarket?: boolean | null
          notes?: string | null
          off_street_parking?: boolean | null
          offered?: number | null
          project_id: number
          sc_gr_annual?: number | null
          sq_metres?: number | null
          url_link?: string | null
          user_id?: string | null
          view?: Database["public"]["Enums"]["quality_assessment_enum"]
          view_date?: string | null
          walk_to_park?: number | null
          walk_to_station?: number | null
        }
        Update: {
          agent_email?: string | null
          agent_phone?: string | null
          agent_website?: string | null
          created_at?: string
          energy_effeciency?: number | null
          floor_level?: number | null
          garden_balcony?: boolean | null
          house_price?: number | null
          id?: number
          interior?: Database["public"]["Enums"]["quality_assessment_enum"]
          lease_length?: number | null
          listing_title?: string | null
          local_gym?: boolean | null
          local_supermarket?: boolean | null
          notes?: string | null
          off_street_parking?: boolean | null
          offered?: number | null
          project_id?: number
          sc_gr_annual?: number | null
          sq_metres?: number | null
          url_link?: string | null
          user_id?: string | null
          view?: Database["public"]["Enums"]["quality_assessment_enum"]
          view_date?: string | null
          walk_to_park?: number | null
          walk_to_station?: number | null
        }
      }
      user_likes_properties: {
        Row: {
          created_at: string
          property_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          property_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          property_id?: number
          user_id?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string
        }
        Insert: {
          id: string
          updated_at?: string | null
          username: string
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string
        }
      }
      user_property_notes: {
        Row: {
          created_at: string
          id: string
          note: string
          property_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note: string
          property_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string
          property_id?: number
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_to_project_members: {
        Args: {
          project_name: string
          project_password: string
        }
        Returns: {
          created_at: string | null
          id: number
          name: string
          password: string
        }[]
      }
      insert_project_and_add_member: {
        Args: {
          project_name: string
          project_password: string
        }
        Returns: {
          created_at: string | null
          id: number
          name: string
          password: string
        }[]
      }
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
