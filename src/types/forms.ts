export interface PersonalDetails {
  fullName: string;
  idNumber: string;
  email: string;
  phone: string;
  address?: string;
}

export interface BusinessDetails {
  companyName: string;
  companyId: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
}

export interface ProviderSwitchData {
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
  currentProvider: string;
  newProvider: string;
  newPlan?: string;
  customerType: 'private' | 'business';
  personalDetails?: PersonalDetails;
  businessDetails?: BusinessDetails;
  signature?: string;
  submissionId?: string;
  documentId?: string;
  timestamp: string;
  monthlySavings?: number;
}

export interface FormStepProps<T = any> {
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
  customerType: 'private' | 'business';
  data: T;
  onUpdate: (data: T) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export interface SigningData {
  documentUrl: string;
  signingUrl?: string;
  status: 'pending' | 'signed' | 'failed';
  timestamp: string;
}