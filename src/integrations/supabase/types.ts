export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      backups: {
        Row: {
          created_at: string
          data: Json
          description: string | null
          id: string
          name: string
          size: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data: Json
          description?: string | null
          id?: string
          name: string
          size?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json
          description?: string | null
          id?: string
          name?: string
          size?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      cart_history: {
        Row: {
          action_type: string
          created_at: string
          id: string
          payment_id: string | null
          payment_status: string | null
          product_id: string | null
          profit: number | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          payment_id?: string | null
          payment_status?: string | null
          product_id?: string | null
          profit?: number | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          payment_id?: string | null
          payment_status?: string | null
          product_id?: string | null
          profit?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      delivery_orders: {
        Row: {
          amount: string
          created_at: string
          customer_address: string
          customer_name: string
          customer_phone: string
          id: string
          product_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: string
          created_at?: string
          customer_address: string
          customer_name: string
          customer_phone: string
          id?: string
          product_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: string
          created_at?: string
          customer_address?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          product_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_points: {
        Row: {
          created_at: string
          id: string
          lifetime_points: number | null
          points: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lifetime_points?: number | null
          points?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lifetime_points?: number | null
          points?: number | null
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
          scheduled_for: string | null
          target_audience: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_sent?: boolean | null
          message: string
          scheduled_for?: string | null
          target_audience?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_sent?: boolean | null
          message?: string
          scheduled_for?: string | null
          target_audience?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_tracking: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id: string
          status: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_tracking_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "delivery_orders"
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
          id: string
          payment_id: string | null
          product_id: string | null
          product_name: string
          status: string
          updated_at: string
        }
        Insert: {
          amount: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          payment_id?: string | null
          product_id?: string | null
          product_name: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          payment_id?: string | null
          product_id?: string | null
          product_name?: string
          status?: string
          updated_at?: string
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
      product_categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      product_tags: {
        Row: {
          created_at: string
          id: string
          product_id: string
          tag: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          tag: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
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
          available_for_delivery: boolean | null
          category: string
          created_at: string
          description: string | null
          download_info: Json | null
          features: string[] | null
          id: string
          image: string
          is_available: boolean | null
          is_physical: boolean | null
          name: string
          payment_link: string | null
          price: string
          purchase_price: number | null
          rating: number | null
          reviews: number | null
          stock_alert_threshold: number | null
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          available_for_delivery?: boolean | null
          category: string
          created_at?: string
          description?: string | null
          download_info?: Json | null
          features?: string[] | null
          id?: string
          image: string
          is_available?: boolean | null
          is_physical?: boolean | null
          name: string
          payment_link?: string | null
          price: string
          purchase_price?: number | null
          rating?: number | null
          reviews?: number | null
          stock_alert_threshold?: number | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          available_for_delivery?: boolean | null
          category?: string
          created_at?: string
          description?: string | null
          download_info?: Json | null
          features?: string[] | null
          id?: string
          image?: string
          is_available?: boolean | null
          is_physical?: boolean | null
          name?: string
          payment_link?: string | null
          price?: string
          purchase_price?: number | null
          rating?: number | null
          reviews?: number | null
          stock_alert_threshold?: number | null
          stock_quantity?: number | null
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
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_status: string | null
          subscription_type: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          subscription_type?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          subscription_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          current_uses: number | null
          discount_amount: number | null
          discount_percentage: number | null
          end_date: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          minimum_purchase: number | null
          start_date: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number | null
          discount_amount?: number | null
          discount_percentage?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          minimum_purchase?: number | null
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number | null
          discount_amount?: number | null
          discount_percentage?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          minimum_purchase?: number | null
          start_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_carts: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
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
      site_settings: {
        Row: {
          created_at: string
          id: string
          logo_text: string
          logo_url: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_text: string
          logo_url: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_text?: string
          logo_url?: string
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
          updated_at: string
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
          updated_at?: string
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
          updated_at?: string
        }
        Relationships: []
      }
      stock_history: {
        Row: {
          change_type: string
          created_at: string
          created_by: string | null
          id: string
          new_quantity: number
          notes: string | null
          previous_quantity: number
          product_id: string | null
        }
        Insert: {
          change_type: string
          created_at?: string
          created_by?: string | null
          id?: string
          new_quantity: number
          notes?: string | null
          previous_quantity: number
          product_id?: string | null
        }
        Update: {
          change_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          new_quantity?: number
          notes?: string | null
          previous_quantity?: number
          product_id?: string | null
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
          is_read: boolean | null
          notification_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          notification_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
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
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
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
      is_admin: {
        Args: { user_id?: string }
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
