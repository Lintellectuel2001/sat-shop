export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      analytics_settings: {
        Row: {
          created_at: string
          ga_tracking_id: string | null
          gtag_tracking_id: string | null
          id: string
          is_enabled: boolean | null
          track_downloads: boolean | null
          track_ecommerce: boolean | null
          track_scroll: boolean | null
        }
        Insert: {
          created_at?: string
          ga_tracking_id?: string | null
          gtag_tracking_id?: string | null
          id?: string
          is_enabled?: boolean | null
          track_downloads?: boolean | null
          track_ecommerce?: boolean | null
          track_scroll?: boolean | null
        }
        Update: {
          created_at?: string
          ga_tracking_id?: string | null
          gtag_tracking_id?: string | null
          id?: string
          is_enabled?: boolean | null
          track_downloads?: boolean | null
          track_ecommerce?: boolean | null
          track_scroll?: boolean | null
        }
        Relationships: []
      }
      backups: {
        Row: {
          created_at: string
          data: Json
          description: string | null
          id: string
          name: string
          size: number | null
        }
        Insert: {
          created_at?: string
          data?: Json
          description?: string | null
          id?: string
          name: string
          size?: number | null
        }
        Update: {
          created_at?: string
          data?: Json
          description?: string | null
          id?: string
          name?: string
          size?: number | null
        }
        Relationships: []
      }
      cart_history: {
        Row: {
          action_type: string
          created_at: string
          id: string
          payment_status: string | null
          product_id: string | null
          profit: number | null
        }
        Insert: {
          action_type?: string
          created_at?: string
          id?: string
          payment_status?: string | null
          product_id?: string | null
          profit?: number | null
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          payment_status?: string | null
          product_id?: string | null
          profit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_orders: {
        Row: {
          actual_delivery: string | null
          created_at: string
          delivery_address: string | null
          delivery_notes: string | null
          delivery_status: string
          estimated_delivery: string | null
          id: string
          order_id: string | null
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          actual_delivery?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_notes?: string | null
          delivery_status?: string
          estimated_delivery?: string | null
          id?: string
          order_id?: string | null
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          actual_delivery?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_notes?: string | null
          delivery_status?: string
          estimated_delivery?: string | null
          id?: string
          order_id?: string | null
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_points: {
        Row: {
          created_at: string
          id: string
          lifetime_points: number
          points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lifetime_points?: number
          points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lifetime_points?: number
          points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loyalty_transactions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          points: number
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          points: number
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          points?: number
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      marketing_notifications: {
        Row: {
          created_at: string
          id: string
          is_sent: boolean | null
          message: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_sent?: boolean | null
          message: string
          title: string
          type?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_sent?: boolean | null
          message?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      meta_descriptions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          keywords: string | null
          page_url: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          keywords?: string | null
          page_url: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          keywords?: string | null
          page_url?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      order_tracking: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          order_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string | null
          status: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_tracking_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: string
          created_at: string
          customer_email: string | null
          customer_name: string | null
          guest_address: string | null
          guest_email: string | null
          guest_phone: string | null
          id: string
          order_token: string | null
          payment_id: string | null
          product_id: string | null
          product_name: string
          status: string
          user_id: string | null
        }
        Insert: {
          amount: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          guest_address?: string | null
          guest_email?: string | null
          guest_phone?: string | null
          id?: string
          order_token?: string | null
          payment_id?: string | null
          product_id?: string | null
          product_name: string
          status?: string
          user_id?: string | null
        }
        Update: {
          amount?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          guest_address?: string | null
          guest_email?: string | null
          guest_phone?: string | null
          id?: string
          order_token?: string | null
          payment_id?: string | null
          product_id?: string | null
          product_name?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_tags: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          tag: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          tag: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_tags_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          image: string
          is_available: boolean | null
          is_physical: boolean | null
          name: string
          payment_link: string
          price: string
          purchase_price: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          image: string
          is_available?: boolean | null
          is_physical?: boolean | null
          name: string
          payment_link?: string
          price: string
          purchase_price?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          image?: string
          is_available?: boolean | null
          is_physical?: boolean | null
          name?: string
          payment_link?: string
          price?: string
          purchase_price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          current_uses: number
          discount_amount: number | null
          discount_percentage: number | null
          end_date: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          minimum_purchase: number | null
          start_date: string | null
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number
          discount_amount?: number | null
          discount_percentage?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          minimum_purchase?: number | null
          start_date?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number
          discount_amount?: number | null
          discount_percentage?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          minimum_purchase?: number | null
          start_date?: string | null
        }
        Relationships: []
      }
      saved_carts: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          quantity: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          quantity?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          quantity?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_carts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_keywords: {
        Row: {
          created_at: string
          current_position: number | null
          difficulty: string | null
          id: string
          keyword: string
          last_checked: string | null
          previous_position: number | null
          search_volume: number | null
          target_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_position?: number | null
          difficulty?: string | null
          id?: string
          keyword: string
          last_checked?: string | null
          previous_position?: number | null
          search_volume?: number | null
          target_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_position?: number | null
          difficulty?: string | null
          id?: string
          keyword?: string
          last_checked?: string | null
          previous_position?: number | null
          search_volume?: number | null
          target_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          logo_text: string | null
          logo_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_text?: string | null
          logo_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_text?: string | null
          logo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      slides: {
        Row: {
          blur_image: boolean | null
          color: string | null
          created_at: string
          description: string | null
          id: string
          image: string
          is_4k_wallpaper: boolean | null
          order: number
          text_color: string | null
          title: string
        }
        Insert: {
          blur_image?: boolean | null
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image: string
          is_4k_wallpaper?: boolean | null
          order?: number
          text_color?: string | null
          title: string
        }
        Update: {
          blur_image?: boolean | null
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string
          is_4k_wallpaper?: boolean | null
          order?: number
          text_color?: string | null
          title?: string
        }
        Relationships: []
      }
      stock_history: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          quantity_change: number
          reason: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          quantity_change?: number
          reason?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          quantity_change?: number
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          notification_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          notification_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          notification_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notifications_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "marketing_notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
