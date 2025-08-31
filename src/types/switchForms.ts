export type ServiceCategory = 'electricity' | 'cellular' | 'internet' | 'tv';
export type CustomerType = 'private' | 'business';

// Base interfaces
export interface BasePersonalDetails {
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
}

export interface BusinessDetails {
  companyName: string;
  companyId: string;
  authorizedSignatory: string;
  signatoryId: string;
  signatoryRole: string;
  contactEmail: string;
}

export interface FileUpload {
  file: File | null;
  required: boolean;
  uploaded: boolean;
}

// Form interfaces for each category and customer type
export interface ElectricityPrivateForm extends BasePersonalDetails {
  currentProvider: string;
  targetProvider: string;
  contractNumber: string;
  meterNumber: string;
  consumptionAddress: string;
  powerOfAttorneyExpiry: string;
  consumerIdCopy: FileUpload;
  attorneyIdCopy: FileUpload;
  billingNotes?: string;
}

export interface ElectricityBusinessForm extends BusinessDetails {
  currentProvider: string;
  targetProvider: string;
  consumptionPoints: Array<{
    contractOrMeter: string;
    address: string;
  }>;
  powerOfAttorneyExpiry: string;
  companyRegistration: FileUpload;
  signatoryIdCopy: FileUpload;
}

export interface CellularPrivateForm extends BasePersonalDetails {
  currentProvider: string;
  targetProvider: string;
  phoneNumbers: string[];
  powerOfAttorneyExpiry: string;
  acceptOtpConfirmation: boolean;
  subscriberIdCopy: FileUpload;
  lastBill?: FileUpload;
}

export interface CellularBusinessForm extends BusinessDetails {
  currentProvider: string;
  targetProvider: string;
  customerNumber?: string;
  phoneNumbers: string[];
  powerOfAttorneyExpiry: string;
  companyRegistration: FileUpload;
  signatoryIdCopy: FileUpload;
}

export interface InternetPrivateForm extends BasePersonalDetails {
  infrastructureProvider: string;
  currentISP: string;
  lineIdentifier: string;
  targetProvider: string;
  requestedPackage: string;
  powerOfAttorneyExpiry: string;
  isBundleService: boolean;
  subscriberIdCopy: FileUpload;
}

export interface InternetBusinessForm extends BusinessDetails {
  infrastructureProvider: string;
  currentISP: string;
  customerAccountNumber?: string;
  sites: Array<{
    lineIdentifier: string;
    address: string;
  }>;
  targetProvider: string;
  requestedPackage: string;
  powerOfAttorneyExpiry: string;
  companyRegistration: FileUpload;
  signatoryIdCopy: FileUpload;
}

export interface TVPrivateForm extends BasePersonalDetails {
  currentProvider: string;
  subscriberNumber: string;
  targetProvider?: string;
  requestedPackage?: string;
  equipmentReturnMethod: 'courier' | 'pickup-point';
  powerOfAttorneyExpiry: string;
  subscriberIdCopy: FileUpload;
}

export interface TVBusinessForm extends BusinessDetails {
  currentProvider: string;
  subscriberNumber: string;
  targetProvider?: string;
  requestedPackage?: string;
  equipmentReturnMethod: 'courier' | 'pickup-point';
  powerOfAttorneyExpiry: string;
  companyRegistration: FileUpload;
  signatoryIdCopy: FileUpload;
}

export type SwitchFormData = 
  | ElectricityPrivateForm 
  | ElectricityBusinessForm
  | CellularPrivateForm
  | CellularBusinessForm
  | InternetPrivateForm
  | InternetBusinessForm
  | TVPrivateForm
  | TVBusinessForm;

export interface FormValidation {
  isValid: boolean;
  errors: string[];
}

export interface PowerOfAttorneyTexts {
  short: string;
  full: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  required: boolean;
}