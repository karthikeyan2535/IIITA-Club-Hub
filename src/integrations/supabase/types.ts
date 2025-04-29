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
      club_announcements: {
        Row: {
          club_id: string
          content: string
          created_at: string | null
          created_by: string
          id: string
          title: string
        }
        Insert: {
          club_id: string
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          title: string
        }
        Update: {
          club_id?: string
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_announcements_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      club_followers: {
        Row: {
          club_id: string
          followed_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          club_id: string
          followed_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          club_id?: string
          followed_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_followers_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      club_members: {
        Row: {
          club_id: string
          email: string
          id: string
          joined_at: string | null
          name: string
          role: string
          user_id: string
        }
        Insert: {
          club_id: string
          email: string
          id?: string
          joined_at?: string | null
          name: string
          role: string
          user_id: string
        }
        Update: {
          club_id?: string
          email?: string
          id?: string
          joined_at?: string | null
          name?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_members_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          category: string
          created_at: string | null
          description: string
          event_count: number | null
          followers: number | null
          id: string
          image_url: string | null
          leads: string[] | null
          member_count: number | null
          name: string
          ongoing_activities: string[] | null
          organizer_id: string | null
          updated_at: string | null
          vision: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          event_count?: number | null
          followers?: number | null
          id?: string
          image_url?: string | null
          leads?: string[] | null
          member_count?: number | null
          name: string
          ongoing_activities?: string[] | null
          organizer_id?: string | null
          updated_at?: string | null
          vision?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          event_count?: number | null
          followers?: number | null
          id?: string
          image_url?: string | null
          leads?: string[] | null
          member_count?: number | null
          name?: string
          ongoing_activities?: string[] | null
          organizer_id?: string | null
          updated_at?: string | null
          vision?: string | null
        }
        Relationships: []
      }
      event_bookmarks: {
        Row: {
          bookmarked_at: string | null
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          bookmarked_at?: string | null
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          bookmarked_at?: string | null
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_bookmarks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participants: {
        Row: {
          attendance: boolean | null
          email: string
          event_id: string
          id: string
          name: string
          registered_at: string | null
          user_id: string
        }
        Insert: {
          attendance?: boolean | null
          email: string
          event_id: string
          id?: string
          name: string
          registered_at?: string | null
          user_id: string
        }
        Update: {
          attendance?: boolean | null
          email?: string
          event_id?: string
          id?: string
          name?: string
          registered_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          club_id: string | null
          club_name: string
          created_at: string | null
          date: string
          description: string
          eligibility: string | null
          highlights: string | null
          id: string
          image_url: string | null
          location: string
          max_participants: number | null
          organizer_id: string | null
          registered_participants: number | null
          results: string | null
          rules: string[] | null
          time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          club_id?: string | null
          club_name: string
          created_at?: string | null
          date: string
          description: string
          eligibility?: string | null
          highlights?: string | null
          id?: string
          image_url?: string | null
          location: string
          max_participants?: number | null
          organizer_id?: string | null
          registered_participants?: number | null
          results?: string | null
          rules?: string[] | null
          time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          club_id?: string | null
          club_name?: string
          created_at?: string | null
          date?: string
          description?: string
          eligibility?: string | null
          highlights?: string | null
          id?: string
          image_url?: string | null
          location?: string
          max_participants?: number | null
          organizer_id?: string | null
          registered_participants?: number | null
          results?: string | null
          rules?: string[] | null
          time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          role: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
        }
        Relationships: []
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
