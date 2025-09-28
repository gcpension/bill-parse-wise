export type ActionType = 'disconnect' | 'switch' | 'move' | 'early_terminate';
export type Sector = 'cellular' | 'internet_isp' | 'internet_infra' | 'tv' | 'electricity';
export type CustomerType = 'private' | 'business';

// Cellular specific types
export interface CellularLine {
  msisdn: string;
  owner_id?: string;
  sim_type: 'SIM' | 'eSIM';
  port_out?: boolean;
  port_in_provider?: string;
}

export interface CellularData {
  lines: CellularLine[];
  porting_otp?: string;
  cancel_vas: {
    intl: boolean;
    premium: boolean;
    other: boolean;
  };
  power_of_attorney_file?: File;
}

// Internet ISP specific types
export interface InternetISPData {
  isp_account_no: string;
  install_address_different?: boolean;
  install_address?: string;
  pppoe_user?: string;
  ont_serial?: string;
  bundle: {
    is_bundle: boolean;
    components: string[];
  };
  equipment_return: {
    items: string[];
    method: 'courier' | 'dropoff';
    slot?: string;
  };
}

// Internet Infrastructure specific types
export interface InternetInfraData {
  infra_provider: 'bezeq' | 'hot';
  contract_no: string;
  ont_or_modem_serial?: string;
  cm_mac?: string;
  tech_visit: {
    required: boolean;
    slot?: string;
  };
  equipment_return: {
    items: string[];
    method: 'courier' | 'dropoff';
    slot?: string;
  };
}

// TV specific types
export interface TVData {
  tv_account_no: string;
  decoders: number;
  ott_profiles: number;
  install_address_different?: boolean;
  install_address?: string;
  equipment_return: {
    items: string[];
    method: 'courier' | 'dropoff';
    slot?: string;
  };
}

// Electricity specific types
export interface ElectricityData {
  electricity_account_no: string;
  meter_number: string;
  consumption_points: Array<{
    point_id: string;
    address: string;
    meter_type: string;
  }>;
  current_tariff?: string;
  avg_monthly_kwh?: number;
}

export interface ServiceRequestFormData {
  // Step 1 - General Choices
  action_type: ActionType;
  sector: Sector;
  customer_type: CustomerType;
  
  // Business specific fields
  corp_registration_number?: string;
  company_name?: string;
  signer_name?: string;
  signer_title?: string;
  power_of_attorney_file?: File;
  
  // Step 2 - Basic Data
  full_name: string;
  national_id_or_corp: string;
  email: string;
  phone: string;
  service_address: {
    street: string;
    number: string;
    city: string;
    zip: string;
  };
  current_provider: string;
  target_provider?: string;
  
  // Provider-specific fields
  customer_number?: string;
  account_number?: string;
  current_customer_number?: string;
  current_account_number?: string;
  current_meter_number?: string;
  current_last_reading?: string;
  current_subscriber_number?: string;
  current_sim_number?: string;
  current_puk_code?: string;
  current_line_number?: string;
  current_phone_number?: string;
  current_installation_address?: string;
  current_mac_address?: string;
  current_modem_serial?: string;
  current_decoder_number?: string;
  current_smart_card?: string;
  target_customer_number?: string;
  target_account_number?: string;
  target_subscriber_number?: string;
  additional_notes?: string;
  // Auto-detected plan information
  selected_plan_name?: string;
  selected_plan_price?: number;
  selected_plan_features?: string[];
  preferred_contact_window?: string;
  preferred_language: 'he' | 'en' | 'ru' | 'other';
  account_or_contract_no?: string;
  payment_last4_optional?: string;
  last_bill_file?: File;
  id_doc_file?: File;
  
  // Step 3 - Declarations
  poa: boolean;
  privacy_tos: boolean;
  fees_ack: boolean;
  esign_ok: boolean;
  
  // Step 4 - Sector Specific Data
  cellular_data?: CellularData;
  internet_isp_data?: InternetISPData;
  internet_infra_data?: InternetInfraData;
  tv_data?: TVData;
  electricity_data?: ElectricityData;
}

export interface ServiceRequestState {
  currentStep: number;
  formData: Partial<ServiceRequestFormData>;
  isValid: boolean;
  errors: Record<string, string>;
}