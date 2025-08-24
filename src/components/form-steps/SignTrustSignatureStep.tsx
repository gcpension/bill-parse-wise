import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SignTrustIntegration } from '@/components/SignTrustIntegration';
import { FormStepProps, SigningData } from '@/types/forms';

interface SignTrustSignatureStepProps extends FormStepProps {
  onSigningComplete?: (signingData: SigningData) => void;
}

export const SignTrustSignatureStep: React.FC<SignTrustSignatureStepProps> = ({
  category,
  customerType,
  data,
  onUpdate,
  onSigningComplete
}) => {
  const handleSigningComplete = (signingData: SigningData) => {
    // Update form data with signing information
    onUpdate({
      ...data,
      signedDocumentUrl: signingData.documentUrl,
      signedAt: signingData.timestamp,
      signingStatus: signingData.status
    });
    
    // Notify parent component
    onSigningComplete?.(signingData);
  };

  const customerDetails = {
    fullName: data.fullName || data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    idNumber: data.idNumber || data.personalId || ''
  };

  return (
    <SignTrustIntegration
      customerDetails={customerDetails}
      currentProvider={data.currentProvider || ''}
      newProvider={data.selectedProvider || ''}
      category={category}
      documentData={data}
      onSigningComplete={handleSigningComplete}
    />
  );
};