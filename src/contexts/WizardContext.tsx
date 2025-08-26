import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { WizardState, WizardContextType, PersonalDetails, CurrentServiceDetails, NewServiceSelection, PaymentDetails, ConsentData, DigitalSignatureData } from '@/types/wizard';

const initialState: WizardState = {
  step: 1,
  personalDetails: {},
  currentService: {},
  newService: {},
  payment: {},
  consent: {},
  signature: {},
  isSubmitted: false,
};

type WizardAction =
  | { type: 'UPDATE_STEP'; payload: number }
  | { type: 'UPDATE_PERSONAL_DETAILS'; payload: Partial<PersonalDetails> }
  | { type: 'UPDATE_CURRENT_SERVICE'; payload: Partial<CurrentServiceDetails> }
  | { type: 'UPDATE_NEW_SERVICE'; payload: Partial<NewServiceSelection> }
  | { type: 'UPDATE_PAYMENT'; payload: Partial<PaymentDetails> }
  | { type: 'UPDATE_CONSENT'; payload: Partial<ConsentData> }
  | { type: 'UPDATE_SIGNATURE'; payload: Partial<DigitalSignatureData> }
  | { type: 'SET_REQUEST_ID'; payload: string }
  | { type: 'SET_SUBMITTED'; payload: boolean }
  | { type: 'RESET_WIZARD' };

const wizardReducer = (state: WizardState, action: WizardAction): WizardState => {
  switch (action.type) {
    case 'UPDATE_STEP':
      return { ...state, step: action.payload };
    case 'UPDATE_PERSONAL_DETAILS':
      return { 
        ...state, 
        personalDetails: { ...state.personalDetails, ...action.payload }
      };
    case 'UPDATE_CURRENT_SERVICE':
      return { 
        ...state, 
        currentService: { ...state.currentService, ...action.payload }
      };
    case 'UPDATE_NEW_SERVICE':
      return { 
        ...state, 
        newService: { ...state.newService, ...action.payload }
      };
    case 'UPDATE_PAYMENT':
      return { 
        ...state, 
        payment: { ...state.payment, ...action.payload }
      };
    case 'UPDATE_CONSENT':
      return { 
        ...state, 
        consent: { ...state.consent, ...action.payload }
      };
    case 'UPDATE_SIGNATURE':
      return { 
        ...state, 
        signature: { ...state.signature, ...action.payload }
      };
    case 'SET_REQUEST_ID':
      return { ...state, requestId: action.payload };
    case 'SET_SUBMITTED':
      return { ...state, isSubmitted: action.payload };
    case 'RESET_WIZARD':
      return initialState;
    default:
      return state;
  }
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const updateStep = (step: number) => {
    dispatch({ type: 'UPDATE_STEP', payload: step });
  };

  const updatePersonalDetails = (data: Partial<PersonalDetails>) => {
    dispatch({ type: 'UPDATE_PERSONAL_DETAILS', payload: data });
    // Auto-save to localStorage
    const savedData = localStorage.getItem('wizard_state');
    const currentState = savedData ? JSON.parse(savedData) : {};
    localStorage.setItem('wizard_state', JSON.stringify({
      ...currentState,
      personalDetails: { ...currentState.personalDetails, ...data }
    }));
  };

  const updateCurrentService = (data: Partial<CurrentServiceDetails>) => {
    dispatch({ type: 'UPDATE_CURRENT_SERVICE', payload: data });
    // Auto-save to localStorage
    const savedData = localStorage.getItem('wizard_state');
    const currentState = savedData ? JSON.parse(savedData) : {};
    localStorage.setItem('wizard_state', JSON.stringify({
      ...currentState,
      currentService: { ...currentState.currentService, ...data }
    }));
  };

  const updateNewService = (data: Partial<NewServiceSelection>) => {
    dispatch({ type: 'UPDATE_NEW_SERVICE', payload: data });
    // Auto-save to localStorage
    const savedData = localStorage.getItem('wizard_state');
    const currentState = savedData ? JSON.parse(savedData) : {};
    localStorage.setItem('wizard_state', JSON.stringify({
      ...currentState,
      newService: { ...currentState.newService, ...data }
    }));
  };

  const updatePayment = (data: Partial<PaymentDetails>) => {
    dispatch({ type: 'UPDATE_PAYMENT', payload: data });
  };

  const updateConsent = (data: Partial<ConsentData>) => {
    dispatch({ type: 'UPDATE_CONSENT', payload: data });
  };

  const updateSignature = (data: Partial<DigitalSignatureData>) => {
    dispatch({ type: 'UPDATE_SIGNATURE', payload: data });
  };

  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case 2:
        return !!(state.personalDetails.firstName && 
                 state.personalDetails.lastName && 
                 state.personalDetails.idNumber && 
                 state.personalDetails.email);
      case 3:
        return !!(state.currentService.providerName && 
                 state.currentService.customerNumber && 
                 state.currentService.serviceType);
      case 4:
        return !!(state.newService.newProvider && state.newService.newPlan);
      case 5:
        return !!(state.payment.paymentMethod && state.consent.dataProcessingConsent);
      default:
        return true;
    }
  };

  const submitRequest = async (): Promise<string> => {
    try {
      // First, submit to Google Sheets
      const { googleSheetsService } = await import('@/lib/googleSheets');
      
      const googleSheetsData = {
        name: `${state.personalDetails.firstName || ''} ${state.personalDetails.lastName || ''}`.trim(),
        phone: state.personalDetails.phone || '',
        email: state.personalDetails.email || '',
        serviceType: state.currentService.serviceType || '',
        plan: state.newService.newPlan || ''
      };

      // Submit to Google Sheets (non-blocking)
      googleSheetsService.submitToGoogleSheets(googleSheetsData).catch(error => {
        console.warn('Google Sheets submission failed:', error);
      });

      // If Supabase isn't configured, complete locally (demo mode)
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
      const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
      if (!supabaseUrl || !supabaseAnon) {
        const requestId = `demo-${Date.now()}`;
        dispatch({ type: 'SET_REQUEST_ID', payload: requestId });
        dispatch({ type: 'SET_SUBMITTED', payload: true });
        localStorage.removeItem('wizard_state');
        console.warn('Supabase not configured. Completed flow in demo mode with local requestId:', requestId);
        return requestId;
      }

      // Call Supabase Edge Function
      const response = await fetch(`${supabaseUrl}/functions/v1/create-switch-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnon}`,
        },
        body: JSON.stringify({
          personalDetails: state.personalDetails,
          currentService: state.currentService,
          newService: state.newService,
          payment: state.payment,
          consent: state.consent,
          signature: state.signature,
        }),
      });

      if (!response.ok) {
        let message = 'Failed to submit request';
        try {
          const errorData = await response.json();
          message = errorData.message || message;
        } catch {}
        throw new Error(message);
      }

      const data = await response.json();
      const requestId = data.requestId;
      
      dispatch({ type: 'SET_REQUEST_ID', payload: requestId });
      dispatch({ type: 'SET_SUBMITTED', payload: true });
      
      // Clear localStorage after successful submission
      localStorage.removeItem('wizard_state');
      
      return requestId;
    } catch (error) {
      console.error('Error submitting request:', error);
      throw error;
    }
  };

  return (
    <WizardContext.Provider value={{
      state,
      updateStep,
      updatePersonalDetails,
      updateCurrentService,
      updateNewService,
      updatePayment,
      updateConsent,
      updateSignature,
      submitRequest,
      canProceedToStep
    }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = (): WizardContextType => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};