export interface PersonalDetails {
  firstName: string;
  lastName: string;
  idNumber: string;
  birthDate: string;
  address: {
    street: string;
    houseNumber: string;
    city: string;
    zipCode: string;
  };
  phone: string;
  email: string;
  idDocument?: File;
  idSupplement?: File;
}

export interface PaymentDetails {
  creditCardLast4?: string;
  bankAccount?: string;
  paymentMethod: 'credit' | 'bank_transfer' | 'direct_debit';
  isOwner: boolean;
  paymentProof?: File;
}

export interface CurrentServiceDetails {
  providerName: string;
  customerNumber: string;
  serviceType: 'electricity' | 'internet' | 'cellular' | 'insurance';
  currentPlan: string;
  lastBill?: File;
  contractCommitment?: string;
  commitmentEndDate?: string;
}

export interface NewServiceSelection {
  newProvider: string;
  newPlan: string;
  switchDate: 'immediate' | 'end_of_billing' | 'end_of_commitment' | 'custom';
  customSwitchDate?: string;
}

export interface ConsentData {
  dataProcessingConsent: boolean;
  powerOfAttorneyConsent: boolean;
  termsAndConditionsConsent: boolean;
  exitFeesAwareness: boolean;
  gdprConsent: boolean;
  finalConfirmation: boolean;
}

export interface DigitalSignatureData {
  signature: string;
  timestamp: string;
  ipAddress: string;
  powerOfAttorneyAgreed: boolean;
}

export interface WizardState {
  step: number;
  personalDetails: Partial<PersonalDetails>;
  currentService: Partial<CurrentServiceDetails>;
  newService: Partial<NewServiceSelection>;
  payment: Partial<PaymentDetails>;
  consent: Partial<ConsentData>;
  signature: Partial<DigitalSignatureData>;
  requestId?: string;
  isSubmitted: boolean;
}

export interface WizardContextType {
  state: WizardState;
  updateStep: (step: number) => void;
  updatePersonalDetails: (data: Partial<PersonalDetails>) => void;
  updateCurrentService: (data: Partial<CurrentServiceDetails>) => void;
  updateNewService: (data: Partial<NewServiceSelection>) => void;
  updatePayment: (data: Partial<PaymentDetails>) => void;
  updateConsent: (data: Partial<ConsentData>) => void;
  updateSignature: (data: Partial<DigitalSignatureData>) => void;
  submitRequest: () => Promise<string>;
  canProceedToStep: (step: number) => boolean;
}