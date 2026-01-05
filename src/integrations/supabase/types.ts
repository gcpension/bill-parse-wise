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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      service_requests: {
        Row: {
          account_number: string | null
          account_or_contract_no: string | null
          action_type: string
          additional_notes: string | null
          cellular_data: Json | null
          company_name: string | null
          comsign_request_id: string | null
          corp_registration_number: string | null
          created_at: string
          current_account_number: string | null
          current_customer_number: string | null
          current_decoder_number: string | null
          current_installation_address: string | null
          current_last_reading: string | null
          current_line_number: string | null
          current_mac_address: string | null
          current_meter_number: string | null
          current_modem_serial: string | null
          current_phone_number: string | null
          current_provider: string | null
          current_puk_code: string | null
          current_sim_number: string | null
          current_smart_card: string | null
          current_subscriber_number: string | null
          customer_number: string | null
          customer_type: string
          electricity_data: Json | null
          email: string
          esign_ok: boolean | null
          fees_ack: boolean | null
          full_name: string
          id: string
          internet_infra_data: Json | null
          internet_isp_data: Json | null
          national_id_or_corp: string
          payment_last4_optional: string | null
          phone: string
          poa: boolean | null
          preferred_contact_window: string | null
          preferred_language: string | null
          privacy_tos: boolean | null
          reference_number: string | null
          sector: string
          selected_plan_features: Json | null
          selected_plan_name: string | null
          selected_plan_price: number | null
          service_address: Json
          signature_status: string | null
          signer_name: string | null
          signer_title: string | null
          status: string
          target_account_number: string | null
          target_customer_number: string | null
          target_provider: string | null
          target_subscriber_number: string | null
          tv_data: Json | null
          updated_at: string
        }
        Insert: {
          account_number?: string | null
          account_or_contract_no?: string | null
          action_type?: string
          additional_notes?: string | null
          cellular_data?: Json | null
          company_name?: string | null
          comsign_request_id?: string | null
          corp_registration_number?: string | null
          created_at?: string
          current_account_number?: string | null
          current_customer_number?: string | null
          current_decoder_number?: string | null
          current_installation_address?: string | null
          current_last_reading?: string | null
          current_line_number?: string | null
          current_mac_address?: string | null
          current_meter_number?: string | null
          current_modem_serial?: string | null
          current_phone_number?: string | null
          current_provider?: string | null
          current_puk_code?: string | null
          current_sim_number?: string | null
          current_smart_card?: string | null
          current_subscriber_number?: string | null
          customer_number?: string | null
          customer_type?: string
          electricity_data?: Json | null
          email: string
          esign_ok?: boolean | null
          fees_ack?: boolean | null
          full_name: string
          id?: string
          internet_infra_data?: Json | null
          internet_isp_data?: Json | null
          national_id_or_corp: string
          payment_last4_optional?: string | null
          phone: string
          poa?: boolean | null
          preferred_contact_window?: string | null
          preferred_language?: string | null
          privacy_tos?: boolean | null
          reference_number?: string | null
          sector: string
          selected_plan_features?: Json | null
          selected_plan_name?: string | null
          selected_plan_price?: number | null
          service_address?: Json
          signature_status?: string | null
          signer_name?: string | null
          signer_title?: string | null
          status?: string
          target_account_number?: string | null
          target_customer_number?: string | null
          target_provider?: string | null
          target_subscriber_number?: string | null
          tv_data?: Json | null
          updated_at?: string
        }
        Update: {
          account_number?: string | null
          account_or_contract_no?: string | null
          action_type?: string
          additional_notes?: string | null
          cellular_data?: Json | null
          company_name?: string | null
          comsign_request_id?: string | null
          corp_registration_number?: string | null
          created_at?: string
          current_account_number?: string | null
          current_customer_number?: string | null
          current_decoder_number?: string | null
          current_installation_address?: string | null
          current_last_reading?: string | null
          current_line_number?: string | null
          current_mac_address?: string | null
          current_meter_number?: string | null
          current_modem_serial?: string | null
          current_phone_number?: string | null
          current_provider?: string | null
          current_puk_code?: string | null
          current_sim_number?: string | null
          current_smart_card?: string | null
          current_subscriber_number?: string | null
          customer_number?: string | null
          customer_type?: string
          electricity_data?: Json | null
          email?: string
          esign_ok?: boolean | null
          fees_ack?: boolean | null
          full_name?: string
          id?: string
          internet_infra_data?: Json | null
          internet_isp_data?: Json | null
          national_id_or_corp?: string
          payment_last4_optional?: string | null
          phone?: string
          poa?: boolean | null
          preferred_contact_window?: string | null
          preferred_language?: string | null
          privacy_tos?: boolean | null
          reference_number?: string | null
          sector?: string
          selected_plan_features?: Json | null
          selected_plan_name?: string | null
          selected_plan_price?: number | null
          service_address?: Json
          signature_status?: string | null
          signer_name?: string | null
          signer_title?: string | null
          status?: string
          target_account_number?: string | null
          target_customer_number?: string | null
          target_provider?: string | null
          target_subscriber_number?: string | null
          tv_data?: Json | null
          updated_at?: string
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
