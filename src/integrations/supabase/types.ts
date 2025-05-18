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
      companies: {
        Row: {
          areaofspecialize: string | null
          cin: string | null
          companyprofile: string | null
          companysector: string | null
          companystatus: string | null
          companytype: string | null
          country: string | null
          created_at: string
          description: string | null
          domain: string | null
          email: string | null
          enduserchannel: string | null
          entitytype: string | null
          facebook: string | null
          founded: number | null
          globalregion: string | null
          holocation: string | null
          id: string
          industry: string | null
          industry1: string | null
          industry2: string | null
          industry3: string | null
          linkedin: string | null
          location: string | null
          name: string
          noofdirectives: string | null
          noofemployee: string | null
          paidupcapital: string | null
          phone: string | null
          region: string | null
          registeredemailaddress: string | null
          registeredofficeaddress: string | null
          registrationdate: string | null
          segmentaspernumberofemployees: string | null
          segmentasperpaidupcapital: string | null
          segmentasperturnover: string | null
          serviceline: string | null
          size: string | null
          turnover: string | null
          turnoveryear: string | null
          twitter: string | null
          updated_at: string
          verticles: string | null
          website: string | null
          yearofestablishment: string | null
        }
        Insert: {
          areaofspecialize?: string | null
          cin?: string | null
          companyprofile?: string | null
          companysector?: string | null
          companystatus?: string | null
          companytype?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          domain?: string | null
          email?: string | null
          enduserchannel?: string | null
          entitytype?: string | null
          facebook?: string | null
          founded?: number | null
          globalregion?: string | null
          holocation?: string | null
          id?: string
          industry?: string | null
          industry1?: string | null
          industry2?: string | null
          industry3?: string | null
          linkedin?: string | null
          location?: string | null
          name: string
          noofdirectives?: string | null
          noofemployee?: string | null
          paidupcapital?: string | null
          phone?: string | null
          region?: string | null
          registeredemailaddress?: string | null
          registeredofficeaddress?: string | null
          registrationdate?: string | null
          segmentaspernumberofemployees?: string | null
          segmentasperpaidupcapital?: string | null
          segmentasperturnover?: string | null
          serviceline?: string | null
          size?: string | null
          turnover?: string | null
          turnoveryear?: string | null
          twitter?: string | null
          updated_at?: string
          verticles?: string | null
          website?: string | null
          yearofestablishment?: string | null
        }
        Update: {
          areaofspecialize?: string | null
          cin?: string | null
          companyprofile?: string | null
          companysector?: string | null
          companystatus?: string | null
          companytype?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          domain?: string | null
          email?: string | null
          enduserchannel?: string | null
          entitytype?: string | null
          facebook?: string | null
          founded?: number | null
          globalregion?: string | null
          holocation?: string | null
          id?: string
          industry?: string | null
          industry1?: string | null
          industry2?: string | null
          industry3?: string | null
          linkedin?: string | null
          location?: string | null
          name?: string
          noofdirectives?: string | null
          noofemployee?: string | null
          paidupcapital?: string | null
          phone?: string | null
          region?: string | null
          registeredemailaddress?: string | null
          registeredofficeaddress?: string | null
          registrationdate?: string | null
          segmentaspernumberofemployees?: string | null
          segmentasperpaidupcapital?: string | null
          segmentasperturnover?: string | null
          serviceline?: string | null
          size?: string | null
          turnover?: string | null
          turnoveryear?: string | null
          twitter?: string | null
          updated_at?: string
          verticles?: string | null
          website?: string | null
          yearofestablishment?: string | null
        }
        Relationships: []
      }
      custom_field_values: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          field_id: string | null
          id: string
          updated_at: string
          value: Json | null
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          field_id?: string | null
          id?: string
          updated_at?: string
          value?: Json | null
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          field_id?: string | null
          id?: string
          updated_at?: string
          value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_field_values_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "custom_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_fields: {
        Row: {
          applicable_forms: Json | null
          created_at: string
          description: string | null
          field_key: string
          field_type: string
          id: string
          name: string
          options: Json | null
          required: boolean | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          applicable_forms?: Json | null
          created_at?: string
          description?: string | null
          field_key: string
          field_type: string
          id?: string
          name: string
          options?: Json | null
          required?: boolean | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          applicable_forms?: Json | null
          created_at?: string
          description?: string | null
          field_key?: string
          field_type?: string
          id?: string
          name?: string
          options?: Json | null
          required?: boolean | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_fields_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      dropdown_option_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      dropdown_options: {
        Row: {
          category_id: string
          created_at: string
          id: string
          is_default: boolean | null
          label: string
          sort_order: number | null
          updated_at: string
          value: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          label: string
          sort_order?: number | null
          updated_at?: string
          value: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          label?: string
          sort_order?: number | null
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "dropdown_options_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "dropdown_option_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      talent_skills: {
        Row: {
          created_at: string
          id: string
          proficiency_level: string | null
          skill_id: string
          talent_id: string
          years_of_experience: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          proficiency_level?: string | null
          skill_id: string
          talent_id: string
          years_of_experience?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          proficiency_level?: string | null
          skill_id?: string
          talent_id?: string
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "talent_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_skills_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talents"
            referencedColumns: ["id"]
          },
        ]
      }
      talents: {
        Row: {
          availability_status: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          current_salary: number | null
          desired_salary: number | null
          email: string
          full_name: string
          id: string
          location: string | null
          phone: string | null
          updated_at: string
          user_id: string | null
          years_of_experience: number | null
        }
        Insert: {
          availability_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          current_salary?: number | null
          desired_salary?: number | null
          email: string
          full_name: string
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
          years_of_experience?: number | null
        }
        Update: {
          availability_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          current_salary?: number | null
          desired_salary?: number | null
          email?: string
          full_name?: string
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
          years_of_experience?: number | null
        }
        Relationships: []
      }
      tenant_ai_models: {
        Row: {
          api_key: string | null
          created_at: string
          id: string
          model_id: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          api_key?: string | null
          created_at?: string
          id?: string
          model_id: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          api_key?: string | null
          created_at?: string
          id?: string
          model_id?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_ai_models_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          description: string | null
          domain: string | null
          id: string
          name: string
          registration_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          domain?: string | null
          id?: string
          name: string
          registration_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          domain?: string | null
          id?: string
          name?: string
          registration_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_tenants: {
        Row: {
          created_at: string
          department: string | null
          id: string
          manager_id: string | null
          tenant_id: string
          user_id: string
          user_role: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          id?: string
          manager_id?: string | null
          tenant_id: string
          user_id: string
          user_role?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          id?: string
          manager_id?: string | null
          tenant_id?: string
          user_id?: string
          user_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_tenants_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tenants_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tenants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_user_profile: {
        Args: { user_email: string; user_full_name: string; user_role: string }
        Returns: string
      }
      is_super_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "user" | "tenant_admin" | "super_admin"
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
    Enums: {
      user_role: ["user", "tenant_admin", "super_admin"],
    },
  },
} as const
