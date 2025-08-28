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
      // Generate request ID first
      const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
      
      console.log('🚀 Starting submission process with requestId:', requestId);
      
      // Import Google Sheets service
      const { googleSheetsService } = await import('@/lib/googleSheets');
      const { supabase, isSupabaseReady } = await import('@/lib/supabaseClient');
      
      // Prepare data for Google Sheets
      const googleSheetsData = {
        name: `${state.personalDetails.firstName || ''} ${state.personalDetails.lastName || ''}`.trim(),
        phone: state.personalDetails.phone || '',
        email: state.personalDetails.email || '',
        serviceType: state.currentService.serviceType || '',
        plan: `${state.currentService.providerName} → ${state.newService.newProvider}`,
        referenceNumber: requestId,
        customerType: 'private',
        timestamp: new Date().toISOString()
      };
      
      // Submit to Google Sheets directly using GoogleSheetsService
      console.log('🔄 שולח נתונים ל-Google Sheets...');
      console.log('📋 נתוני Google Sheets:', googleSheetsData);
      
      const googleSheetsSuccess = await googleSheetsService.submitToGoogleSheets(googleSheetsData);
      
      if (!googleSheetsSuccess) {
        console.error('❌ שגיאה בשליחה ל-Google Sheets');
        throw new Error('שגיאה בשליחה ל-Google Sheets. אנא נסה שוב.');
      }
      
      console.log('✅ הנתונים נשלחו בהצלחה ל-Google Sheets');

      // Send notification email only if Supabase is available
      if (googleSheetsSuccess && isSupabaseReady()) {
        console.log('📧 שולח מייל התראה...');
        const emailResponse = await supabase.functions.invoke('send-switch-notification', {
          body: {
            ...googleSheetsData,
            requestId,
            submissionTime: new Date().toISOString()
          }
        });
        
        console.log('📧 תגובת מייל:', emailResponse);
        
        if (emailResponse.error) {
          console.error('❌ שגיאה בשליחת מייל:', emailResponse.error);
          // Don't throw error here - Google Sheets submission was successful
        } else {
          console.log('✅ מייל ההתראה נשלח בהצלחה');
        }
      } else if (googleSheetsSuccess && !isSupabaseReady()) {
        console.log('⚠️ Supabase לא מחובר - מייל התראה לא נשלח, אבל הנתונים נשמרו ב-Google Sheets');
      }

      // Store request in Supabase database (optional - only if Supabase is connected)
      if (isSupabaseReady()) {
        try {
          const { data: dbResult, error: dbError } = await supabase.functions.invoke(
            'create-switch-request',
            {
              body: {
                requestId,
                personalDetails: state.personalDetails,
                currentService: state.currentService,
                newService: state.newService,
                payment: state.payment,
                consent: state.consent,
                signature: state.signature,
              }
            }
          );

          if (dbError) {
            console.warn('Database storage failed:', dbError);
            // Don't fail the entire process if DB storage fails
          } else {
            console.log('Request stored in database:', dbResult);
          }
        } catch (dbErr) {
          console.warn('Database storage error:', dbErr);
        }
      } else {
        console.log('ℹ️ Supabase לא מחובר - נתונים לא נשמרים במסד הנתונים');
      }
      
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