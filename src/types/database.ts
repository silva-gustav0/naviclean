export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      anamnesis: {
        Row: {
          allergies_list: string | null
          appointment_id: string | null
          cardiovascular_notes: string | null
          chief_complaint: string | null
          clinic_id: string
          consumes_alcohol: boolean | null
          diabetes_type: string | null
          filled_at: string | null
          filled_by: string
          has_allergies: boolean | null
          has_cancer_history: boolean | null
          has_cardiovascular: boolean | null
          has_coagulation_issues: boolean | null
          has_diabetes: boolean | null
          has_infectious_disease: boolean | null
          history_of_present_illness: string | null
          id: string
          infectious_disease_notes: string | null
          is_breastfeeding: boolean | null
          is_pregnant: boolean | null
          medication_list: string | null
          pain_currently: boolean | null
          pain_level: number | null
          patient_id: string
          smokes: boolean | null
          smoking_status: string | null
          smoking_stopped_years: number | null
          updated_at: string | null
          uses_continuous_medication: boolean | null
        }
        Insert: {
          allergies_list?: string | null
          appointment_id?: string | null
          cardiovascular_notes?: string | null
          chief_complaint?: string | null
          clinic_id: string
          consumes_alcohol?: boolean | null
          diabetes_type?: string | null
          filled_at?: string | null
          filled_by?: string
          has_allergies?: boolean | null
          has_cancer_history?: boolean | null
          has_cardiovascular?: boolean | null
          has_coagulation_issues?: boolean | null
          has_diabetes?: boolean | null
          has_infectious_disease?: boolean | null
          history_of_present_illness?: string | null
          id?: string
          infectious_disease_notes?: string | null
          is_breastfeeding?: boolean | null
          is_pregnant?: boolean | null
          medication_list?: string | null
          pain_currently?: boolean | null
          pain_level?: number | null
          patient_id: string
          smokes?: boolean | null
          smoking_status?: string | null
          smoking_stopped_years?: number | null
          updated_at?: string | null
          uses_continuous_medication?: boolean | null
        }
        Update: {
          allergies_list?: string | null
          appointment_id?: string | null
          cardiovascular_notes?: string | null
          chief_complaint?: string | null
          clinic_id?: string
          consumes_alcohol?: boolean | null
          diabetes_type?: string | null
          filled_at?: string | null
          filled_by?: string
          has_allergies?: boolean | null
          has_cancer_history?: boolean | null
          has_cardiovascular?: boolean | null
          has_coagulation_issues?: boolean | null
          has_diabetes?: boolean | null
          has_infectious_disease?: boolean | null
          history_of_present_illness?: string | null
          id?: string
          infectious_disease_notes?: string | null
          is_breastfeeding?: boolean | null
          is_pregnant?: boolean | null
          medication_list?: string | null
          pain_currently?: boolean | null
          pain_level?: number | null
          patient_id?: string
          smokes?: boolean | null
          smoking_status?: string | null
          smoking_stopped_years?: number | null
          updated_at?: string | null
          uses_continuous_medication?: boolean | null
        }
        Relationships: [
          { foreignKeyName: "anamnesis_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "anamnesis_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] },
        ]
      }
      anamnesis_tokens: {
        Row: {
          clinic_id: string
          created_at: string | null
          expires_at: string
          id: string
          patient_id: string
          token: string
          used_at: string | null
        }
        Insert: {
          clinic_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          patient_id: string
          token: string
          used_at?: string | null
        }
        Update: {
          clinic_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          patient_id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: [
          { foreignKeyName: "anamnesis_tokens_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "anamnesis_tokens_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] },
        ]
      }
      appointment_events: {
        Row: {
          appointment_id: string
          changed_by: string | null
          clinic_id: string
          created_at: string | null
          from_status: Database["public"]["Enums"]["appointment_status"] | null
          id: string
          to_status: Database["public"]["Enums"]["appointment_status"]
        }
        Insert: {
          appointment_id: string
          changed_by?: string | null
          clinic_id: string
          created_at?: string | null
          from_status?: Database["public"]["Enums"]["appointment_status"] | null
          id?: string
          to_status: Database["public"]["Enums"]["appointment_status"]
        }
        Update: {
          appointment_id?: string
          changed_by?: string | null
          clinic_id?: string
          created_at?: string | null
          from_status?: Database["public"]["Enums"]["appointment_status"] | null
          id?: string
          to_status?: Database["public"]["Enums"]["appointment_status"]
        }
        Relationships: [
          { foreignKeyName: "appointment_events_appointment_id_fkey"; columns: ["appointment_id"]; isOneToOne: false; referencedRelation: "appointments"; referencedColumns: ["id"] },
          { foreignKeyName: "appointment_events_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
        ]
      }
      appointments: {
        Row: {
          clinic_id: string
          confirmation_sent: boolean | null
          created_at: string | null
          date: string
          dentist_id: string
          end_time: string
          id: string
          internal_notes: string | null
          notes: string | null
          patient_id: string
          reminder_sent: boolean | null
          service_id: string | null
          start_time: string
          status: Database["public"]["Enums"]["appointment_status"] | null
          updated_at: string | null
        }
        Insert: {
          clinic_id: string
          confirmation_sent?: boolean | null
          created_at?: string | null
          date: string
          dentist_id: string
          end_time: string
          id?: string
          internal_notes?: string | null
          notes?: string | null
          patient_id: string
          reminder_sent?: boolean | null
          service_id?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string | null
        }
        Update: {
          clinic_id?: string
          confirmation_sent?: boolean | null
          created_at?: string | null
          date?: string
          dentist_id?: string
          end_time?: string
          id?: string
          internal_notes?: string | null
          notes?: string | null
          patient_id?: string
          reminder_sent?: boolean | null
          service_id?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          { foreignKeyName: "appointments_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "appointments_dentist_id_fkey"; columns: ["dentist_id"]; isOneToOne: false; referencedRelation: "clinic_members"; referencedColumns: ["id"] },
          { foreignKeyName: "appointments_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] },
          { foreignKeyName: "appointments_service_id_fkey"; columns: ["service_id"]; isOneToOne: false; referencedRelation: "services"; referencedColumns: ["id"] },
        ]
      }
      audit_log: {
        Row: {
          action: string
          clinic_id: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          clinic_id: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          clinic_id?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          { foreignKeyName: "audit_log_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "audit_log_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          clinic_id: string
          content: string
          cover_image_url: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["blog_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          clinic_id: string
          content: string
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["blog_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          clinic_id?: string
          content?: string
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["blog_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          { foreignKeyName: "blog_posts_author_id_fkey"; columns: ["author_id"]; isOneToOne: false; referencedRelation: "clinic_members"; referencedColumns: ["id"] },
          { foreignKeyName: "blog_posts_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
        ]
      }
      clinic_members: {
        Row: {
          affiliation: Database["public"]["Enums"]["professional_affiliation"] | null
          bio: string | null
          bio_long: string | null
          clinic_id: string
          created_at: string | null
          cro: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          procedures_performed: string[] | null
          profile_photo_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          rqe: string | null
          specialty: string | null
          user_id: string
        }
        Insert: {
          affiliation?: Database["public"]["Enums"]["professional_affiliation"] | null
          bio?: string | null
          bio_long?: string | null
          clinic_id: string
          created_at?: string | null
          cro?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          procedures_performed?: string[] | null
          profile_photo_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          rqe?: string | null
          specialty?: string | null
          user_id: string
        }
        Update: {
          affiliation?: Database["public"]["Enums"]["professional_affiliation"] | null
          bio?: string | null
          bio_long?: string | null
          clinic_id?: string
          created_at?: string | null
          cro?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          procedures_performed?: string[] | null
          profile_photo_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          rqe?: string | null
          specialty?: string | null
          user_id?: string
        }
        Relationships: [
          { foreignKeyName: "clinic_members_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "clinic_members_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
      clinics: {
        Row: {
          address_city: string | null
          address_complement: string | null
          address_neighborhood: string | null
          address_number: string | null
          address_state: string | null
          address_street: string | null
          address_zip: string | null
          allow_online_booking: boolean | null
          appointment_buffer_minutes: number | null
          appointment_duration_minutes: number | null
          auto_confirm_appointments: boolean | null
          bank_info: Json | null
          cnpj: string | null
          cover_image_url: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          email: string | null
          id: string
          is_active: boolean | null
          latitude: number | null
          legal_name: string | null
          logo_url: string | null
          longitude: number | null
          meta_description: string | null
          meta_title: string | null
          name: string
          owner_id: string
          phone: string | null
          primary_color: string | null
          secondary_color: string | null
          slug: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_plan: Database["public"]["Enums"]["subscription_plan"] | null
          subscription_status: Database["public"]["Enums"]["subscription_status"] | null
          technical_responsible_cro: string | null
          technical_responsible_name: string | null
          timezone: string | null
          trial_ends_at: string | null
          updated_at: string | null
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          allow_online_booking?: boolean | null
          appointment_buffer_minutes?: number | null
          appointment_duration_minutes?: number | null
          auto_confirm_appointments?: boolean | null
          bank_info?: Json | null
          cnpj?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          legal_name?: string | null
          logo_url?: string | null
          longitude?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          owner_id: string
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          slug: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_plan?: Database["public"]["Enums"]["subscription_plan"] | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"] | null
          technical_responsible_cro?: string | null
          technical_responsible_name?: string | null
          timezone?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          allow_online_booking?: boolean | null
          appointment_buffer_minutes?: number | null
          appointment_duration_minutes?: number | null
          auto_confirm_appointments?: boolean | null
          bank_info?: Json | null
          cnpj?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          legal_name?: string | null
          logo_url?: string | null
          longitude?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          owner_id?: string
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          slug?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_plan?: Database["public"]["Enums"]["subscription_plan"] | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"] | null
          technical_responsible_cro?: string | null
          technical_responsible_name?: string | null
          timezone?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          { foreignKeyName: "clinics_owner_id_fkey"; columns: ["owner_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
      clinical_evolutions: {
        Row: {
          appointment_id: string | null
          author_member_id: string
          clinic_id: string
          created_at: string | null
          id: string
          materials_used: string | null
          observations: string | null
          patient_id: string
          procedures_performed: string
          signed_at: string | null
          signed_by_cro: string | null
          signed_by_name: string | null
          signed_hash: string | null
          status: Database["public"]["Enums"]["evolution_status"]
          tooth_numbers: number[] | null
        }
        Insert: {
          appointment_id?: string | null
          author_member_id: string
          clinic_id: string
          created_at?: string | null
          id?: string
          materials_used?: string | null
          observations?: string | null
          patient_id: string
          procedures_performed: string
          signed_at?: string | null
          signed_by_cro?: string | null
          signed_by_name?: string | null
          signed_hash?: string | null
          status?: Database["public"]["Enums"]["evolution_status"]
          tooth_numbers?: number[] | null
        }
        Update: {
          appointment_id?: string | null
          author_member_id?: string
          clinic_id?: string
          created_at?: string | null
          id?: string
          materials_used?: string | null
          observations?: string | null
          patient_id?: string
          procedures_performed?: string
          signed_at?: string | null
          signed_by_cro?: string | null
          signed_by_name?: string | null
          signed_hash?: string | null
          status?: Database["public"]["Enums"]["evolution_status"]
          tooth_numbers?: number[] | null
        }
        Relationships: [
          { foreignKeyName: "clinical_evolutions_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "clinical_evolutions_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] },
          { foreignKeyName: "clinical_evolutions_author_member_id_fkey"; columns: ["author_member_id"]; isOneToOne: false; referencedRelation: "clinic_members"; referencedColumns: ["id"] },
        ]
      }
      commission_rules: {
        Row: {
          clinic_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          member_id: string
          percentage: number
          price_table_id: string | null
          priority: number | null
          service_category: string | null
          service_id: string | null
        }
        Insert: {
          clinic_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          member_id: string
          percentage: number
          price_table_id?: string | null
          priority?: number | null
          service_category?: string | null
          service_id?: string | null
        }
        Update: {
          clinic_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          member_id?: string
          percentage?: number
          price_table_id?: string | null
          priority?: number | null
          service_category?: string | null
          service_id?: string | null
        }
        Relationships: [
          { foreignKeyName: "commission_rules_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "commission_rules_member_id_fkey"; columns: ["member_id"]; isOneToOne: false; referencedRelation: "clinic_members"; referencedColumns: ["id"] },
        ]
      }
      commissions: {
        Row: {
          clinic_id: string
          commission_amount: number
          created_at: string | null
          direct_costs_amount: number
          gross_amount: number
          id: string
          member_id: string
          net_amount: number
          paid_out_at: string | null
          percentage: number
          released_at: string | null
          service_id: string | null
          status: string
          transaction_id: string
        }
        Insert: {
          clinic_id: string
          commission_amount: number
          created_at?: string | null
          direct_costs_amount?: number
          gross_amount: number
          id?: string
          member_id: string
          net_amount: number
          paid_out_at?: string | null
          percentage: number
          released_at?: string | null
          service_id?: string | null
          status?: string
          transaction_id: string
        }
        Update: {
          clinic_id?: string
          commission_amount?: number
          created_at?: string | null
          direct_costs_amount?: number
          gross_amount?: number
          id?: string
          member_id?: string
          net_amount?: number
          paid_out_at?: string | null
          percentage?: number
          released_at?: string | null
          service_id?: string | null
          status?: string
          transaction_id?: string
        }
        Relationships: [
          { foreignKeyName: "commissions_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "commissions_member_id_fkey"; columns: ["member_id"]; isOneToOne: false; referencedRelation: "clinic_members"; referencedColumns: ["id"] },
          { foreignKeyName: "commissions_transaction_id_fkey"; columns: ["transaction_id"]; isOneToOne: false; referencedRelation: "transactions"; referencedColumns: ["id"] },
        ]
      }
      dental_chart: {
        Row: {
          clinic_id: string
          condition: Database["public"]["Enums"]["tooth_condition"]
          id: string
          notes: string | null
          patient_id: string
          tooth_number: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          clinic_id: string
          condition?: Database["public"]["Enums"]["tooth_condition"]
          id?: string
          notes?: string | null
          patient_id: string
          tooth_number: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          clinic_id?: string
          condition?: Database["public"]["Enums"]["tooth_condition"]
          id?: string
          notes?: string | null
          patient_id?: string
          tooth_number?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          { foreignKeyName: "dental_chart_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "dental_chart_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] },
          { foreignKeyName: "dental_chart_updated_by_fkey"; columns: ["updated_by"]; isOneToOne: false; referencedRelation: "clinic_members"; referencedColumns: ["id"] },
        ]
      }
      direct_costs: {
        Row: {
          applies_to_payment_method: Database["public"]["Enums"]["payment_method"] | null
          applies_to_service_id: string | null
          clinic_id: string
          fixed_amount: number | null
          id: string
          is_active: boolean | null
          kind: string
          name: string
          percentage: number | null
        }
        Insert: {
          applies_to_payment_method?: Database["public"]["Enums"]["payment_method"] | null
          applies_to_service_id?: string | null
          clinic_id: string
          fixed_amount?: number | null
          id?: string
          is_active?: boolean | null
          kind: string
          name: string
          percentage?: number | null
        }
        Update: {
          applies_to_payment_method?: Database["public"]["Enums"]["payment_method"] | null
          applies_to_service_id?: string | null
          clinic_id?: string
          fixed_amount?: number | null
          id?: string
          is_active?: boolean | null
          kind?: string
          name?: string
          percentage?: number | null
        }
        Relationships: [
          { foreignKeyName: "direct_costs_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
        ]
      }
      evolution_attachments: {
        Row: {
          attachment_type: string
          evolution_id: string
          file_id: string
          id: string
        }
        Insert: {
          attachment_type: string
          evolution_id: string
          file_id: string
          id?: string
        }
        Update: {
          attachment_type?: string
          evolution_id?: string
          file_id?: string
          id?: string
        }
        Relationships: [
          { foreignKeyName: "evolution_attachments_evolution_id_fkey"; columns: ["evolution_id"]; isOneToOne: false; referencedRelation: "clinical_evolutions"; referencedColumns: ["id"] },
          { foreignKeyName: "evolution_attachments_file_id_fkey"; columns: ["file_id"]; isOneToOne: false; referencedRelation: "files"; referencedColumns: ["id"] },
        ]
      }
      files: {
        Row: {
          clinic_id: string
          created_at: string | null
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          mime_type: string | null
          name: string
          patient_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          clinic_id: string
          created_at?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          mime_type?: string | null
          name: string
          patient_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          clinic_id?: string
          created_at?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          mime_type?: string | null
          name?: string
          patient_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          { foreignKeyName: "files_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "files_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] },
          { foreignKeyName: "files_uploaded_by_fkey"; columns: ["uploaded_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
      insurance_plans: {
        Row: {
          ans_code: string | null
          clinic_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          ans_code?: string | null
          clinic_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          ans_code?: string | null
          clinic_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: [
          { foreignKeyName: "insurance_plans_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
        ]
      }
      leads: {
        Row: {
          clinic_id: string
          converted_patient_id: string | null
          created_at: string | null
          email: string | null
          id: string
          message: string | null
          name: string
          notes: string | null
          phone: string | null
          source: string | null
          status: Database["public"]["Enums"]["lead_status"] | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          clinic_id: string
          converted_patient_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          message?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          clinic_id?: string
          converted_patient_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          { foreignKeyName: "leads_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "leads_converted_patient_id_fkey"; columns: ["converted_patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] },
        ]
      }
      nfe_imports: {
        Row: {
          clinic_id: string
          created_at: string | null
          id: string
          issue_date: string | null
          nfe_key: string
          status: string | null
          supplier_name: string | null
          total_amount: number | null
          xml_url: string | null
        }
        Insert: {
          clinic_id: string
          created_at?: string | null
          id?: string
          issue_date?: string | null
          nfe_key: string
          status?: string | null
          supplier_name?: string | null
          total_amount?: number | null
          xml_url?: string | null
        }
        Update: {
          clinic_id?: string
          created_at?: string | null
          id?: string
          issue_date?: string | null
          nfe_key?: string
          status?: string | null
          supplier_name?: string | null
          total_amount?: number | null
          xml_url?: string | null
        }
        Relationships: [
          { foreignKeyName: "nfe_imports_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
        ]
      }
      notifications: {
        Row: {
          channel: Database["public"]["Enums"]["notification_channel"]
          clinic_id: string
          created_at: string | null
          id: string
          message: string
          patient_id: string | null
          read_at: string | null
          reference_id: string | null
          reference_type: string | null
          sent_at: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          channel: Database["public"]["Enums"]["notification_channel"]
          clinic_id: string
          created_at?: string | null
          id?: string
          message: string
          patient_id?: string | null
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          sent_at?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          channel?: Database["public"]["Enums"]["notification_channel"]
          clinic_id?: string
          created_at?: string | null
          id?: string
          message?: string
          patient_id?: string | null
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          sent_at?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          { foreignKeyName: "notifications_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "notifications_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] },
          { foreignKeyName: "notifications_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
      patient_insurance: {
        Row: {
          id: string
          insurance_plan_id: string
          is_active: boolean | null
          patient_id: string
          policy_number: string | null
          valid_until: string | null
        }
        Insert: {
          id?: string
          insurance_plan_id: string
          is_active?: boolean | null
          patient_id: string
          policy_number?: string | null
          valid_until?: string | null
        }
        Update: {
          id?: string
          insurance_plan_id?: string
          is_active?: boolean | null
          patient_id?: string
          policy_number?: string | null
          valid_until?: string | null
        }
        Relationships: [
          { foreignKeyName: "patient_insurance_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] },
          { foreignKeyName: "patient_insurance_insurance_plan_id_fkey"; columns: ["insurance_plan_id"]; isOneToOne: false; referencedRelation: "insurance_plans"; referencedColumns: ["id"] },
        ]
      }
      patients: {
        Row: {
          address_city: string | null
          address_complement: string | null
          address_neighborhood: string | null
          address_number: string | null
          address_state: string | null
          address_street: string | null
          address_zip: string | null
          allergies: string | null
          anamnesis_completed_at: string | null
          clinic_id: string
          cpf: string | null
          created_at: string | null
          date_of_birth: string | null
          default_price_table_id: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string
          gender: string | null
          health_insurance: string | null
          health_insurance_number: string | null
          id: string
          is_active: boolean | null
          medical_notes: string | null
          medications: string | null
          phone: string | null
          rg: string | null
          updated_at: string | null
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          allergies?: string | null
          anamnesis_completed_at?: string | null
          clinic_id: string
          cpf?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          default_price_table_id?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name: string
          gender?: string | null
          health_insurance?: string | null
          health_insurance_number?: string | null
          id?: string
          is_active?: boolean | null
          medical_notes?: string | null
          medications?: string | null
          phone?: string | null
          rg?: string | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          allergies?: string | null
          anamnesis_completed_at?: string | null
          clinic_id?: string
          cpf?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          default_price_table_id?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string
          gender?: string | null
          health_insurance?: string | null
          health_insurance_number?: string | null
          id?: string
          is_active?: boolean | null
          medical_notes?: string | null
          medications?: string | null
          phone?: string | null
          rg?: string | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          { foreignKeyName: "patients_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "patients_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
      prescriptions: {
        Row: {
          author_member_id: string
          clinic_id: string
          content: string
          created_at: string | null
          days_off: number | null
          evolution_id: string | null
          id: string
          patient_id: string
          pdf_url: string | null
          signed_hash: string | null
          title: string
          type: Database["public"]["Enums"]["prescription_type"]
        }
        Insert: {
          author_member_id: string
          clinic_id: string
          content: string
          created_at?: string | null
          days_off?: number | null
          evolution_id?: string | null
          id?: string
          patient_id: string
          pdf_url?: string | null
          signed_hash?: string | null
          title: string
          type: Database["public"]["Enums"]["prescription_type"]
        }
        Update: {
          author_member_id?: string
          clinic_id?: string
          content?: string
          created_at?: string | null
          days_off?: number | null
          evolution_id?: string | null
          id?: string
          patient_id?: string
          pdf_url?: string | null
          signed_hash?: string | null
          title?: string
          type?: Database["public"]["Enums"]["prescription_type"]
        }
        Relationships: [
          { foreignKeyName: "prescriptions_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "prescriptions_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] },
          { foreignKeyName: "prescriptions_author_member_id_fkey"; columns: ["author_member_id"]; isOneToOne: false; referencedRelation: "clinic_members"; referencedColumns: ["id"] },
        ]
      }
      price_tables: {
        Row: {
          clinic_id: string
          created_at: string | null
          id: string
          insurance_plan_id: string | null
          is_active: boolean | null
          is_default: boolean | null
          name: string
          type: Database["public"]["Enums"]["price_table_type"]
        }
        Insert: {
          clinic_id: string
          created_at?: string | null
          id?: string
          insurance_plan_id?: string | null
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          type: Database["public"]["Enums"]["price_table_type"]
        }
        Update: {
          clinic_id?: string
          created_at?: string | null
          id?: string
          insurance_plan_id?: string | null
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          type?: Database["public"]["Enums"]["price_table_type"]
        }
        Relationships: [
          { foreignKeyName: "price_tables_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "price_tables_insurance_plan_id_fkey"; columns: ["insurance_plan_id"]; isOneToOne: false; referencedRelation: "insurance_plans"; referencedColumns: ["id"] },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cpf: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          cpf?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          full_name: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          cpf?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          clinic_id: string
          comment: string | null
          created_at: string | null
          id: string
          is_published: boolean | null
          member_id: string | null
          patient_id: string
          rating: number
        }
        Insert: {
          clinic_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          member_id?: string | null
          patient_id: string
          rating: number
        }
        Update: {
          clinic_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          member_id?: string | null
          patient_id?: string
          rating?: number
        }
        Relationships: [
          { foreignKeyName: "reviews_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "reviews_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] },
        ]
      }
      service_prices: {
        Row: {
          id: string
          price: number
          price_table_id: string
          service_id: string
        }
        Insert: {
          id?: string
          price: number
          price_table_id: string
          service_id: string
        }
        Update: {
          id?: string
          price?: number
          price_table_id?: string
          service_id?: string
        }
        Relationships: [
          { foreignKeyName: "service_prices_service_id_fkey"; columns: ["service_id"]; isOneToOne: false; referencedRelation: "services"; referencedColumns: ["id"] },
          { foreignKeyName: "service_prices_price_table_id_fkey"; columns: ["price_table_id"]; isOneToOne: false; referencedRelation: "price_tables"; referencedColumns: ["id"] },
        ]
      }
      services: {
        Row: {
          category: string | null
          clinic_id: string
          created_at: string | null
          description: string | null
          display_order: number | null
          duration_minutes: number
          id: string
          is_active: boolean | null
          name: string
          price: number | null
        }
        Insert: {
          category?: string | null
          clinic_id: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          name: string
          price?: number | null
        }
        Update: {
          category?: string | null
          clinic_id?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number | null
        }
        Relationships: [
          { foreignKeyName: "services_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
        ]
      }
      stock_batches: {
        Row: {
          batch_number: string | null
          clinic_id: string
          created_at: string | null
          expiry_date: string | null
          id: string
          nfe_key: string | null
          quantity: number
          stock_item_id: string
        }
        Insert: {
          batch_number?: string | null
          clinic_id: string
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          nfe_key?: string | null
          quantity: number
          stock_item_id: string
        }
        Update: {
          batch_number?: string | null
          clinic_id?: string
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          nfe_key?: string | null
          quantity?: number
          stock_item_id?: string
        }
        Relationships: [
          { foreignKeyName: "stock_batches_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "stock_batches_stock_item_id_fkey"; columns: ["stock_item_id"]; isOneToOne: false; referencedRelation: "stock_items"; referencedColumns: ["id"] },
        ]
      }
      stock_items: {
        Row: {
          brand: string | null
          category: string | null
          clinic_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          minimum_stock: number
          name: string
          unit: string
        }
        Insert: {
          brand?: string | null
          category?: string | null
          clinic_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          minimum_stock?: number
          name: string
          unit: string
        }
        Update: {
          brand?: string | null
          category?: string | null
          clinic_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          minimum_stock?: number
          name?: string
          unit?: string
        }
        Relationships: [
          { foreignKeyName: "stock_items_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
        ]
      }
      stock_movements: {
        Row: {
          appointment_id: string | null
          batch_id: string | null
          clinic_id: string
          created_at: string | null
          id: string
          performed_by: string | null
          quantity: number
          reason: string | null
          stock_item_id: string
          type: Database["public"]["Enums"]["stock_movement_type"]
        }
        Insert: {
          appointment_id?: string | null
          batch_id?: string | null
          clinic_id: string
          created_at?: string | null
          id?: string
          performed_by?: string | null
          quantity: number
          reason?: string | null
          stock_item_id: string
          type: Database["public"]["Enums"]["stock_movement_type"]
        }
        Update: {
          appointment_id?: string | null
          batch_id?: string | null
          clinic_id?: string
          created_at?: string | null
          id?: string
          performed_by?: string | null
          quantity?: number
          reason?: string | null
          stock_item_id?: string
          type?: Database["public"]["Enums"]["stock_movement_type"]
        }
        Relationships: [
          { foreignKeyName: "stock_movements_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "stock_movements_stock_item_id_fkey"; columns: ["stock_item_id"]; isOneToOne: false; referencedRelation: "stock_items"; referencedColumns: ["id"] },
        ]
      }
      tooth_face_marks: {
        Row: {
          clinic_id: string
          color_hex: string | null
          condition: Database["public"]["Enums"]["tooth_condition"]
          created_at: string | null
          created_by: string | null
          face: string
          id: string
          mark_status: string
          notes: string | null
          patient_id: string
          tooth_number: number
          updated_at: string | null
        }
        Insert: {
          clinic_id: string
          color_hex?: string | null
          condition: Database["public"]["Enums"]["tooth_condition"]
          created_at?: string | null
          created_by?: string | null
          face: string
          id?: string
          mark_status?: string
          notes?: string | null
          patient_id: string
          tooth_number: number
          updated_at?: string | null
        }
        Update: {
          clinic_id?: string
          color_hex?: string | null
          condition?: Database["public"]["Enums"]["tooth_condition"]
          created_at?: string | null
          created_by?: string | null
          face?: string
          id?: string
          mark_status?: string
          notes?: string | null
          patient_id?: string
          tooth_number?: number
          updated_at?: string | null
        }
        Relationships: [
          { foreignKeyName: "tooth_face_marks_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "tooth_face_marks_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] },
        ]
      }
      tooth_symbols: {
        Row: {
          clinic_id: string
          created_at: string | null
          created_by: string | null
          id: string
          patient_id: string
          status: string
          symbol: string
          tooth_number: number
        }
        Insert: {
          clinic_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          patient_id: string
          status?: string
          symbol: string
          tooth_number: number
        }
        Update: {
          clinic_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          patient_id?: string
          status?: string
          symbol?: string
          tooth_number?: number
        }
        Relationships: [
          { foreignKeyName: "tooth_symbols_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "tooth_symbols_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] },
        ]
      }
      transactions: {
        Row: {
          amount: number
          appointment_id: string | null
          category: string
          clinic_id: string
          created_at: string | null
          description: string
          due_date: string | null
          id: string
          installment_number: number | null
          installments: number | null
          notes: string | null
          paid_at: string | null
          parent_transaction_id: string | null
          patient_id: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          receipt_url: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          category: string
          clinic_id: string
          created_at?: string | null
          description: string
          due_date?: string | null
          id?: string
          installment_number?: number | null
          installments?: number | null
          notes?: string | null
          paid_at?: string | null
          parent_transaction_id?: string | null
          patient_id?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          receipt_url?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          category?: string
          clinic_id?: string
          created_at?: string | null
          description?: string
          due_date?: string | null
          id?: string
          installment_number?: number | null
          installments?: number | null
          notes?: string | null
          paid_at?: string | null
          parent_transaction_id?: string | null
          patient_id?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          receipt_url?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Relationships: [
          { foreignKeyName: "transactions_appointment_id_fkey"; columns: ["appointment_id"]; isOneToOne: false; referencedRelation: "appointments"; referencedColumns: ["id"] },
          { foreignKeyName: "transactions_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "transactions_parent_transaction_id_fkey"; columns: ["parent_transaction_id"]; isOneToOne: false; referencedRelation: "transactions"; referencedColumns: ["id"] },
          { foreignKeyName: "transactions_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] },
        ]
      }
      treatment_plan_items: {
        Row: {
          description: string
          display_order: number | null
          id: string
          plan_id: string
          quantity: number | null
          service_id: string | null
          status: string | null
          tooth_number: number | null
          total_price: number
          unit_price: number
        }
        Insert: {
          description: string
          display_order?: number | null
          id?: string
          plan_id: string
          quantity?: number | null
          service_id?: string | null
          status?: string | null
          tooth_number?: number | null
          total_price: number
          unit_price: number
        }
        Update: {
          description?: string
          display_order?: number | null
          id?: string
          plan_id?: string
          quantity?: number | null
          service_id?: string | null
          status?: string | null
          tooth_number?: number | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          { foreignKeyName: "treatment_plan_items_plan_id_fkey"; columns: ["plan_id"]; isOneToOne: false; referencedRelation: "treatment_plans"; referencedColumns: ["id"] },
          { foreignKeyName: "treatment_plan_items_service_id_fkey"; columns: ["service_id"]; isOneToOne: false; referencedRelation: "services"; referencedColumns: ["id"] },
        ]
      }
      treatment_plans: {
        Row: {
          approved_at: string | null
          clinic_id: string
          created_at: string | null
          dentist_id: string
          description: string | null
          discount_amount: number | null
          final_amount: number
          id: string
          notes: string | null
          patient_id: string
          status: string | null
          title: string
          total_amount: number
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          approved_at?: string | null
          clinic_id: string
          created_at?: string | null
          dentist_id: string
          description?: string | null
          discount_amount?: number | null
          final_amount: number
          id?: string
          notes?: string | null
          patient_id: string
          status?: string | null
          title: string
          total_amount: number
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          approved_at?: string | null
          clinic_id?: string
          created_at?: string | null
          dentist_id?: string
          description?: string | null
          discount_amount?: number | null
          final_amount?: number
          id?: string
          notes?: string | null
          patient_id?: string
          status?: string | null
          title?: string
          total_amount?: number
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          { foreignKeyName: "treatment_plans_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "treatment_plans_dentist_id_fkey"; columns: ["dentist_id"]; isOneToOne: false; referencedRelation: "clinic_members"; referencedColumns: ["id"] },
          { foreignKeyName: "treatment_plans_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] },
        ]
      }
      treatment_records: {
        Row: {
          appointment_id: string | null
          attachments: string[] | null
          clinic_id: string
          created_at: string | null
          dentist_id: string
          description: string
          diagnosis: string | null
          id: string
          patient_id: string
          prescriptions: string | null
          procedures_performed: string | null
          tooth_numbers: number[] | null
        }
        Insert: {
          appointment_id?: string | null
          attachments?: string[] | null
          clinic_id: string
          created_at?: string | null
          dentist_id: string
          description: string
          diagnosis?: string | null
          id?: string
          patient_id: string
          prescriptions?: string | null
          procedures_performed?: string | null
          tooth_numbers?: number[] | null
        }
        Update: {
          appointment_id?: string | null
          attachments?: string[] | null
          clinic_id?: string
          created_at?: string | null
          dentist_id?: string
          description?: string
          diagnosis?: string | null
          id?: string
          patient_id?: string
          prescriptions?: string | null
          procedures_performed?: string | null
          tooth_numbers?: number[] | null
        }
        Relationships: [
          { foreignKeyName: "treatment_records_appointment_id_fkey"; columns: ["appointment_id"]; isOneToOne: false; referencedRelation: "appointments"; referencedColumns: ["id"] },
          { foreignKeyName: "treatment_records_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "treatment_records_dentist_id_fkey"; columns: ["dentist_id"]; isOneToOne: false; referencedRelation: "clinic_members"; referencedColumns: ["id"] },
          { foreignKeyName: "treatment_records_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] },
        ]
      }
      working_hours: {
        Row: {
          clinic_id: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean | null
          member_id: string | null
          start_time: string
        }
        Insert: {
          clinic_id: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean | null
          member_id?: string | null
          start_time: string
        }
        Update: {
          clinic_id?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          member_id?: string | null
          start_time?: string
        }
        Relationships: [
          { foreignKeyName: "working_hours_clinic_id_fkey"; columns: ["clinic_id"]; isOneToOne: false; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "working_hours_member_id_fkey"; columns: ["member_id"]; isOneToOne: false; referencedRelation: "clinic_members"; referencedColumns: ["id"] },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_clinic_member: { Args: { clinic_uuid: string }; Returns: boolean }
      is_clinic_owner: { Args: { clinic_uuid: string }; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      appointment_status:
        | "scheduled"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "no_show"
        | "waiting_room"
        | "awaiting_payment"
      blog_status: "draft" | "published" | "archived"
      evolution_status: "draft" | "signed"
      lead_status: "new" | "contacted" | "converted" | "lost"
      notification_channel: "email" | "whatsapp" | "sms" | "push"
      payment_method:
        | "cash"
        | "credit_card"
        | "debit_card"
        | "pix"
        | "bank_transfer"
        | "insurance"
      payment_status: "pending" | "paid" | "overdue" | "cancelled" | "refunded"
      prescription_type: "recipe" | "certificate" | "referral"
      price_table_type: "private" | "insurance"
      professional_affiliation: "independent" | "affiliated"
      stock_movement_type: "entry" | "exit" | "adjustment" | "expired"
      subscription_plan: "trial" | "basic" | "professional" | "enterprise"
      subscription_status: "active" | "past_due" | "cancelled" | "trialing"
      tooth_condition:
        | "healthy"
        | "cavity"
        | "filled"
        | "crown"
        | "missing"
        | "implant"
        | "root_canal"
        | "extraction_needed"
      transaction_type: "income" | "expense"
      user_role:
        | "super_admin"
        | "clinic_owner"
        | "dentist"
        | "receptionist"
        | "patient"
        | "doctor"
        | "independent_professional"
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
    Enums: {
      appointment_status: [
        "scheduled",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
        "waiting_room",
        "awaiting_payment",
      ],
      blog_status: ["draft", "published", "archived"],
      evolution_status: ["draft", "signed"],
      lead_status: ["new", "contacted", "converted", "lost"],
      notification_channel: ["email", "whatsapp", "sms", "push"],
      payment_method: [
        "cash",
        "credit_card",
        "debit_card",
        "pix",
        "bank_transfer",
        "insurance",
      ],
      payment_status: ["pending", "paid", "overdue", "cancelled", "refunded"],
      prescription_type: ["recipe", "certificate", "referral"],
      price_table_type: ["private", "insurance"],
      professional_affiliation: ["independent", "affiliated"],
      stock_movement_type: ["entry", "exit", "adjustment", "expired"],
      subscription_plan: ["trial", "basic", "professional", "enterprise"],
      subscription_status: ["active", "past_due", "cancelled", "trialing"],
      tooth_condition: [
        "healthy",
        "cavity",
        "filled",
        "crown",
        "missing",
        "implant",
        "root_canal",
        "extraction_needed",
      ],
      transaction_type: ["income", "expense"],
      user_role: [
        "super_admin",
        "clinic_owner",
        "dentist",
        "receptionist",
        "patient",
        "doctor",
        "independent_professional",
      ],
    },
  },
} as const
