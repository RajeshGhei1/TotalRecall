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
      ai_agents: {
        Row: {
          capabilities: string[] | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          model_config: Json | null
          name: string
          performance_metrics: Json | null
          status: Database["public"]["Enums"]["ai_agent_status"] | null
          tenant_id: string | null
          type: Database["public"]["Enums"]["ai_agent_type"]
          updated_at: string | null
        }
        Insert: {
          capabilities?: string[] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          model_config?: Json | null
          name: string
          performance_metrics?: Json | null
          status?: Database["public"]["Enums"]["ai_agent_status"] | null
          tenant_id?: string | null
          type: Database["public"]["Enums"]["ai_agent_type"]
          updated_at?: string | null
        }
        Update: {
          capabilities?: string[] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          model_config?: Json | null
          name?: string
          performance_metrics?: Json | null
          status?: Database["public"]["Enums"]["ai_agent_status"] | null
          tenant_id?: string | null
          type?: Database["public"]["Enums"]["ai_agent_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_agents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_agents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_decisions: {
        Row: {
          agent_id: string | null
          confidence_score: number | null
          context: Json
          created_at: string | null
          decision: Json
          id: string
          outcome_feedback: Json | null
          reasoning: string[] | null
          tenant_id: string | null
          user_id: string | null
          was_accepted: boolean | null
        }
        Insert: {
          agent_id?: string | null
          confidence_score?: number | null
          context: Json
          created_at?: string | null
          decision: Json
          id?: string
          outcome_feedback?: Json | null
          reasoning?: string[] | null
          tenant_id?: string | null
          user_id?: string | null
          was_accepted?: boolean | null
        }
        Update: {
          agent_id?: string | null
          confidence_score?: number | null
          context?: Json
          created_at?: string | null
          decision?: Json
          id?: string
          outcome_feedback?: Json | null
          reasoning?: string[] | null
          tenant_id?: string | null
          user_id?: string | null
          was_accepted?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_decisions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_decisions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_decisions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_insights: {
        Row: {
          agent_id: string | null
          applicable_modules: string[] | null
          confidence_score: number | null
          created_at: string | null
          expiry_date: string | null
          id: string
          insight_data: Json
          insight_type: string
          is_active: boolean | null
          source_entities: Json | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          applicable_modules?: string[] | null
          confidence_score?: number | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          insight_data: Json
          insight_type: string
          is_active?: boolean | null
          source_entities?: Json | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          applicable_modules?: string[] | null
          confidence_score?: number | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          insight_data?: Json
          insight_type?: string
          is_active?: boolean | null
          source_entities?: Json | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_insights_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          ai_match_reasons: Json | null
          ai_match_score: number | null
          applied_at: string
          candidate_id: string
          cover_letter: string | null
          created_at: string
          id: string
          interview_feedback: Json | null
          job_id: string
          next_action: string | null
          next_action_date: string | null
          recruiter_notes: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          ai_match_reasons?: Json | null
          ai_match_score?: number | null
          applied_at?: string
          candidate_id: string
          cover_letter?: string | null
          created_at?: string
          id?: string
          interview_feedback?: Json | null
          job_id: string
          next_action?: string | null
          next_action_date?: string | null
          recruiter_notes?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          ai_match_reasons?: Json | null
          ai_match_score?: number | null
          applied_at?: string
          candidate_id?: string
          cover_letter?: string | null
          created_at?: string
          id?: string
          interview_feedback?: Json | null
          job_id?: string
          next_action?: string | null
          next_action_date?: string | null
          recruiter_notes?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      behavioral_patterns: {
        Row: {
          created_at: string | null
          frequency_score: number | null
          id: string
          last_occurrence: string | null
          pattern_data: Json
          pattern_type: string
          tenant_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          frequency_score?: number | null
          id?: string
          last_occurrence?: string | null
          pattern_data: Json
          pattern_type: string
          tenant_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          frequency_score?: number | null
          id?: string
          last_occurrence?: string | null
          pattern_data?: Json
          pattern_type?: string
          tenant_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "behavioral_patterns_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "behavioral_patterns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_tags: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      candidates: {
        Row: {
          ai_summary: string | null
          availability_date: string | null
          created_at: string
          current_company: string | null
          current_title: string | null
          desired_salary: number | null
          email: string
          experience_years: number | null
          first_name: string
          id: string
          last_name: string
          linkedin_url: string | null
          location: string | null
          notes: string | null
          phone: string | null
          portfolio_url: string | null
          resume_text: string | null
          resume_url: string | null
          skills: Json | null
          tags: Json | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          ai_summary?: string | null
          availability_date?: string | null
          created_at?: string
          current_company?: string | null
          current_title?: string | null
          desired_salary?: number | null
          email: string
          experience_years?: number | null
          first_name: string
          id?: string
          last_name: string
          linkedin_url?: string | null
          location?: string | null
          notes?: string | null
          phone?: string | null
          portfolio_url?: string | null
          resume_text?: string | null
          resume_url?: string | null
          skills?: Json | null
          tags?: Json | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          ai_summary?: string | null
          availability_date?: string | null
          created_at?: string
          current_company?: string | null
          current_title?: string | null
          desired_salary?: number | null
          email?: string
          experience_years?: number | null
          first_name?: string
          id?: string
          last_name?: string
          linkedin_url?: string | null
          location?: string | null
          notes?: string | null
          phone?: string | null
          portfolio_url?: string | null
          resume_text?: string | null
          resume_url?: string | null
          skills?: Json | null
          tags?: Json | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
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
      company_relationships: {
        Row: {
          company_id: string
          created_at: string
          end_date: string | null
          id: string
          is_current: boolean
          person_id: string
          relationship_type: string
          reports_to: string | null
          role: string
          start_date: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_current?: boolean
          person_id: string
          relationship_type: string
          reports_to?: string | null
          role: string
          start_date: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_current?: boolean
          person_id?: string
          relationship_type?: string
          reports_to?: string | null
          role?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_relationships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_relationships_reports_to_fkey"
            columns: ["reports_to"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
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
          form_id: string | null
          id: string
          name: string
          options: Json | null
          required: boolean | null
          section_id: string | null
          sort_order: number | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          applicable_forms?: Json | null
          created_at?: string
          description?: string | null
          field_key: string
          field_type: string
          form_id?: string | null
          id?: string
          name: string
          options?: Json | null
          required?: boolean | null
          section_id?: string | null
          sort_order?: number | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          applicable_forms?: Json | null
          created_at?: string
          description?: string | null
          field_key?: string
          field_type?: string
          form_id?: string | null
          id?: string
          name?: string
          options?: Json | null
          required?: boolean | null
          section_id?: string | null
          sort_order?: number | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_fields_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_fields_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "form_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_fields_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_layouts: {
        Row: {
          config_id: string
          created_at: string
          height: number
          id: string
          position_x: number
          position_y: number
          updated_at: string
          widget_config: Json | null
          widget_id: string
          width: number
        }
        Insert: {
          config_id: string
          created_at?: string
          height?: number
          id?: string
          position_x?: number
          position_y?: number
          updated_at?: string
          widget_config?: Json | null
          widget_id: string
          width?: number
        }
        Update: {
          config_id?: string
          created_at?: string
          height?: number
          id?: string
          position_x?: number
          position_y?: number
          updated_at?: string
          widget_config?: Json | null
          widget_id?: string
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_layouts_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "user_dashboard_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          layout_config: Json
          name: string
          target_role: string | null
          template_type: string
          updated_at: string
          widget_configs: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          layout_config?: Json
          name: string
          target_role?: string | null
          template_type?: string
          updated_at?: string
          widget_configs?: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          layout_config?: Json
          name?: string
          target_role?: string | null
          template_type?: string
          updated_at?: string
          widget_configs?: Json
        }
        Relationships: []
      }
      dashboard_widgets: {
        Row: {
          category: string
          config_schema: Json
          created_at: string
          data_source_config: Json
          default_config: Json
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          widget_type: string
        }
        Insert: {
          category: string
          config_schema?: Json
          created_at?: string
          data_source_config?: Json
          default_config?: Json
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          widget_type: string
        }
        Update: {
          category?: string
          config_schema?: Json
          created_at?: string
          data_source_config?: Json
          default_config?: Json
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          widget_type?: string
        }
        Relationships: []
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
      form_definitions: {
        Row: {
          access_level: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          required_modules: Json | null
          settings: Json | null
          slug: string
          tenant_id: string | null
          updated_at: string
          visibility_scope: string | null
        }
        Insert: {
          access_level?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          required_modules?: Json | null
          settings?: Json | null
          slug: string
          tenant_id?: string | null
          updated_at?: string
          visibility_scope?: string | null
        }
        Update: {
          access_level?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          required_modules?: Json | null
          settings?: Json | null
          slug?: string
          tenant_id?: string | null
          updated_at?: string
          visibility_scope?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_definitions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_definitions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      form_deployment_points: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          location: Database["public"]["Enums"]["deployment_location"]
          name: string
          target_path: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          location: Database["public"]["Enums"]["deployment_location"]
          name: string
          target_path?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          location?: Database["public"]["Enums"]["deployment_location"]
          name?: string
          target_path?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      form_module_assignments: {
        Row: {
          created_at: string
          form_id: string
          id: string
          module_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          form_id: string
          id?: string
          module_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          form_id?: string
          id?: string
          module_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_module_assignments_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_module_assignments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "system_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      form_notifications: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          notification_type: string
          recipients: Json
          template_data: Json
          trigger_event: string
          updated_at: string
          workflow_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          notification_type: string
          recipients?: Json
          template_data?: Json
          trigger_event: string
          updated_at?: string
          workflow_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          notification_type?: string
          recipients?: Json
          template_data?: Json
          trigger_event?: string
          updated_at?: string
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_notifications_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "form_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      form_placements: {
        Row: {
          configuration: Json | null
          created_at: string
          created_by: string | null
          deployment_point_id: string
          ends_at: string | null
          form_id: string
          id: string
          module_id: string | null
          priority: number
          starts_at: string | null
          status: Database["public"]["Enums"]["placement_status"]
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          configuration?: Json | null
          created_at?: string
          created_by?: string | null
          deployment_point_id: string
          ends_at?: string | null
          form_id: string
          id?: string
          module_id?: string | null
          priority?: number
          starts_at?: string | null
          status?: Database["public"]["Enums"]["placement_status"]
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          configuration?: Json | null
          created_at?: string
          created_by?: string | null
          deployment_point_id?: string
          ends_at?: string | null
          form_id?: string
          id?: string
          module_id?: string | null
          priority?: number
          starts_at?: string | null
          status?: Database["public"]["Enums"]["placement_status"]
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_placements_deployment_point_id_fkey"
            columns: ["deployment_point_id"]
            isOneToOne: false
            referencedRelation: "form_deployment_points"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_placements_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_placements_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "system_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_placements_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      form_response_analytics: {
        Row: {
          created_at: string
          event_data: Json
          event_type: string
          form_id: string
          id: string
          ip_address: unknown | null
          placement_id: string | null
          response_id: string | null
          session_id: string | null
          tenant_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json
          event_type: string
          form_id: string
          id?: string
          ip_address?: unknown | null
          placement_id?: string | null
          response_id?: string | null
          session_id?: string | null
          tenant_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_type?: string
          form_id?: string
          id?: string
          ip_address?: unknown | null
          placement_id?: string | null
          response_id?: string | null
          session_id?: string | null
          tenant_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_response_analytics_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_response_analytics_placement_id_fkey"
            columns: ["placement_id"]
            isOneToOne: false
            referencedRelation: "form_placements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_response_analytics_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "form_responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_response_analytics_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      form_responses: {
        Row: {
          created_at: string
          form_id: string
          id: string
          placement_id: string | null
          processed_at: string | null
          response_data: Json
          status: string
          submitted_at: string
          submitted_by: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          form_id: string
          id?: string
          placement_id?: string | null
          processed_at?: string | null
          response_data?: Json
          status?: string
          submitted_at?: string
          submitted_by?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          form_id?: string
          id?: string
          placement_id?: string | null
          processed_at?: string | null
          response_data?: Json
          status?: string
          submitted_at?: string
          submitted_by?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_responses_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_responses_placement_id_fkey"
            columns: ["placement_id"]
            isOneToOne: false
            referencedRelation: "form_placements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_responses_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      form_sections: {
        Row: {
          created_at: string
          description: string | null
          form_id: string
          id: string
          is_collapsible: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          form_id: string
          id?: string
          is_collapsible?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          form_id?: string
          id?: string
          is_collapsible?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_sections_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      form_submissions: {
        Row: {
          created_at: string
          form_id: string
          id: string
          status: string
          submission_data: Json
          submitted_at: string | null
          submitted_by: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          form_id: string
          id?: string
          status?: string
          submission_data?: Json
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          form_id?: string
          id?: string
          status?: string
          submission_data?: Json
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_submissions_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      form_triggers: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          placement_id: string
          trigger_conditions: Json
          trigger_type: Database["public"]["Enums"]["trigger_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          placement_id: string
          trigger_conditions?: Json
          trigger_type: Database["public"]["Enums"]["trigger_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          placement_id?: string
          trigger_conditions?: Json
          trigger_type?: Database["public"]["Enums"]["trigger_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_triggers_placement_id_fkey"
            columns: ["placement_id"]
            isOneToOne: false
            referencedRelation: "form_placements"
            referencedColumns: ["id"]
          },
        ]
      }
      form_workflows: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          form_id: string
          id: string
          is_active: boolean
          name: string
          trigger_conditions: Json
          updated_at: string
          workflow_steps: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          form_id: string
          id?: string
          is_active?: boolean
          name: string
          trigger_conditions?: Json
          updated_at?: string
          workflow_steps?: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          form_id?: string
          id?: string
          is_active?: boolean
          name?: string
          trigger_conditions?: Json
          updated_at?: string
          workflow_steps?: Json
        }
        Relationships: [
          {
            foreignKeyName: "form_workflows_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_workflows_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          application_id: string
          created_at: string
          duration_minutes: number | null
          feedback: Json | null
          id: string
          interviewer_id: string | null
          location: string | null
          meeting_link: string | null
          notes: string | null
          scheduled_at: string
          score: number | null
          status: string | null
          type: Database["public"]["Enums"]["interview_type"]
          updated_at: string
        }
        Insert: {
          application_id: string
          created_at?: string
          duration_minutes?: number | null
          feedback?: Json | null
          id?: string
          interviewer_id?: string | null
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          scheduled_at: string
          score?: number | null
          status?: string | null
          type: Database["public"]["Enums"]["interview_type"]
          updated_at?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          duration_minutes?: number | null
          feedback?: Json | null
          id?: string
          interviewer_id?: string | null
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          scheduled_at?: string
          score?: number | null
          status?: string | null
          type?: Database["public"]["Enums"]["interview_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          closes_at: string | null
          created_at: string
          created_by: string | null
          department: string | null
          description: string | null
          employment_type: string | null
          hiring_manager_id: string | null
          id: string
          location: string | null
          priority: Database["public"]["Enums"]["priority_level"] | null
          requirements: Json | null
          salary_max: number | null
          salary_min: number | null
          status: Database["public"]["Enums"]["job_status"] | null
          tenant_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          closes_at?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          description?: string | null
          employment_type?: string | null
          hiring_manager_id?: string | null
          id?: string
          location?: string | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          requirements?: Json | null
          salary_max?: number | null
          salary_min?: number | null
          status?: Database["public"]["Enums"]["job_status"] | null
          tenant_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          closes_at?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          description?: string | null
          employment_type?: string | null
          hiring_manager_id?: string | null
          id?: string
          location?: string | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          requirements?: Json | null
          salary_max?: number | null
          salary_min?: number | null
          status?: Database["public"]["Enums"]["job_status"] | null
          tenant_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      module_permissions: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean
          limits: Json | null
          module_name: string
          plan_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          limits?: Json | null
          module_name: string
          plan_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          limits?: Json | null
          module_name?: string
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_permissions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      module_pricing: {
        Row: {
          base_price_annually: number
          base_price_monthly: number
          created_at: string
          id: string
          is_active: boolean
          module_name: string
          tier_pricing: Json | null
          updated_at: string
        }
        Insert: {
          base_price_annually?: number
          base_price_monthly?: number
          created_at?: string
          id?: string
          is_active?: boolean
          module_name: string
          tier_pricing?: Json | null
          updated_at?: string
        }
        Update: {
          base_price_annually?: number
          base_price_monthly?: number
          created_at?: string
          id?: string
          is_active?: boolean
          module_name?: string
          tier_pricing?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      people: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          location: string | null
          phone: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          location?: string | null
          phone?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          location?: string | null
          phone?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
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
      saved_reports: {
        Row: {
          aggregation: Json | null
          columns: Json
          created_at: string | null
          entity: string
          filters: Json
          group_by: string | null
          id: string
          name: string
          updated_at: string | null
          visualization_type: string | null
        }
        Insert: {
          aggregation?: Json | null
          columns?: Json
          created_at?: string | null
          entity: string
          filters?: Json
          group_by?: string | null
          id?: string
          name: string
          updated_at?: string | null
          visualization_type?: string | null
        }
        Update: {
          aggregation?: Json | null
          columns?: Json
          created_at?: string | null
          entity?: string
          filters?: Json
          group_by?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          visualization_type?: string | null
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
      subscription_plans: {
        Row: {
          base_price_annually: number | null
          base_price_monthly: number | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          plan_type: string
          price_annually: number
          price_monthly: number
          updated_at: string
          use_module_pricing: boolean | null
        }
        Insert: {
          base_price_annually?: number | null
          base_price_monthly?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          plan_type: string
          price_annually?: number
          price_monthly?: number
          updated_at?: string
          use_module_pricing?: boolean | null
        }
        Update: {
          base_price_annually?: number | null
          base_price_monthly?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          plan_type?: string
          price_annually?: number
          price_monthly?: number
          updated_at?: string
          use_module_pricing?: boolean | null
        }
        Relationships: []
      }
      system_modules: {
        Row: {
          category: string
          created_at: string
          default_limits: Json | null
          dependencies: string[] | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          version: string | null
        }
        Insert: {
          category: string
          created_at?: string
          default_limits?: Json | null
          dependencies?: string[] | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          default_limits?: Json | null
          dependencies?: string[] | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          version?: string | null
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
      tenant_module_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          created_at: string
          custom_limits: Json | null
          expires_at: string | null
          id: string
          is_enabled: boolean
          module_id: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          custom_limits?: Json | null
          expires_at?: string | null
          id?: string
          is_enabled?: boolean
          module_id: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          custom_limits?: Json | null
          expires_at?: string | null
          id?: string
          is_enabled?: boolean
          module_id?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_module_assignments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "system_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_module_assignments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_subscriptions: {
        Row: {
          billing_cycle: string
          created_at: string
          ends_at: string | null
          id: string
          plan_id: string
          starts_at: string
          status: string
          subscription_level: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          billing_cycle?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          plan_id: string
          starts_at?: string
          status?: string
          subscription_level?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          billing_cycle?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          plan_id?: string
          starts_at?: string
          status?: string
          subscription_level?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
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
      user_dashboard_configs: {
        Row: {
          created_at: string
          dashboard_name: string
          filters: Json | null
          id: string
          is_default: boolean | null
          layout_config: Json
          tenant_id: string | null
          updated_at: string
          user_id: string
          widget_configs: Json
        }
        Insert: {
          created_at?: string
          dashboard_name: string
          filters?: Json | null
          id?: string
          is_default?: boolean | null
          layout_config?: Json
          tenant_id?: string | null
          updated_at?: string
          user_id: string
          widget_configs?: Json
        }
        Update: {
          created_at?: string
          dashboard_name?: string
          filters?: Json | null
          id?: string
          is_default?: boolean | null
          layout_config?: Json
          tenant_id?: string | null
          updated_at?: string
          user_id?: string
          widget_configs?: Json
        }
        Relationships: []
      }
      user_interactions: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          interaction_type: string
          ip_address: unknown | null
          metadata: Json | null
          session_id: string | null
          tenant_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          interaction_type: string
          ip_address?: unknown | null
          metadata?: Json | null
          session_id?: string | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          interaction_type?: string
          ip_address?: unknown | null
          metadata?: Json | null
          session_id?: string | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_interactions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_navigation_preferences: {
        Row: {
          admin_type: string
          created_at: string
          id: string
          preferences: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_type: string
          created_at?: string
          id?: string
          preferences?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_type?: string
          created_at?: string
          id?: string
          preferences?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          assigned_by: string | null
          billing_cycle: string
          created_at: string
          ends_at: string | null
          id: string
          plan_id: string
          starts_at: string
          status: string
          tenant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_by?: string | null
          billing_cycle?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          plan_id: string
          starts_at?: string
          status?: string
          tenant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_by?: string | null
          billing_cycle?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          plan_id?: string
          starts_at?: string
          status?: string
          tenant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
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
      widget_data_sources: {
        Row: {
          cache_duration: number | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          query_config: Json
          refresh_interval: number | null
          source_type: string
          updated_at: string
        }
        Insert: {
          cache_duration?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          query_config?: Json
          refresh_interval?: number | null
          source_type: string
          updated_at?: string
        }
        Update: {
          cache_duration?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          query_config?: Json
          refresh_interval?: number | null
          source_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      workflow_execution_logs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          execution_status: string
          id: string
          response_id: string
          started_at: string
          step_results: Json
          workflow_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          execution_status?: string
          id?: string
          response_id: string
          started_at?: string
          step_results?: Json
          workflow_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          execution_status?: string
          id?: string
          response_id?: string
          started_at?: string
          step_results?: Json
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_execution_logs_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "form_responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_execution_logs_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "form_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      test_data_view: {
        Row: {
          record_count: number | null
          table_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_user_profile: {
        Args: { user_email: string; user_full_name: string; user_role: string }
        Returns: string
      }
      delete_test_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      is_super_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      resolve_user_subscription: {
        Args: { p_user_id: string; p_tenant_id: string }
        Returns: {
          subscription_id: string
          plan_id: string
          status: string
          billing_cycle: string
          subscription_type: string
          starts_at: string
          ends_at: string
        }[]
      }
    }
    Enums: {
      ai_agent_status: "active" | "inactive" | "training" | "error"
      ai_agent_type: "cognitive" | "predictive" | "automation" | "analysis"
      application_status:
        | "applied"
        | "screening"
        | "interview"
        | "offer"
        | "hired"
        | "rejected"
      deployment_location:
        | "dashboard_widget"
        | "modal_dialog"
        | "dedicated_page"
        | "navigation_item"
        | "inline_embed"
        | "sidebar_panel"
      interview_type: "phone" | "video" | "onsite" | "technical"
      job_status: "draft" | "active" | "paused" | "closed"
      placement_status: "active" | "inactive" | "scheduled" | "expired"
      priority_level: "low" | "medium" | "high" | "urgent"
      trigger_type:
        | "user_action"
        | "page_load"
        | "scheduled"
        | "conditional"
        | "manual"
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
      ai_agent_status: ["active", "inactive", "training", "error"],
      ai_agent_type: ["cognitive", "predictive", "automation", "analysis"],
      application_status: [
        "applied",
        "screening",
        "interview",
        "offer",
        "hired",
        "rejected",
      ],
      deployment_location: [
        "dashboard_widget",
        "modal_dialog",
        "dedicated_page",
        "navigation_item",
        "inline_embed",
        "sidebar_panel",
      ],
      interview_type: ["phone", "video", "onsite", "technical"],
      job_status: ["draft", "active", "paused", "closed"],
      placement_status: ["active", "inactive", "scheduled", "expired"],
      priority_level: ["low", "medium", "high", "urgent"],
      trigger_type: [
        "user_action",
        "page_load",
        "scheduled",
        "conditional",
        "manual",
      ],
      user_role: ["user", "tenant_admin", "super_admin"],
    },
  },
} as const
