import { SignTrustIntegration } from '@/components/SignTrustIntegration';

interface SignTrustSignatureStepProps {
  category: string;
  customerType: string;
  data: any;
  onUpdate: (data: any) => void;
}

export const SignTrustSignatureStep = ({ 
  category, 
  customerType, 
  data, 
  onUpdate 
}: SignTrustSignatureStepProps) => {
  
  const handleSigningComplete = (signingData: any) => {
    onUpdate({
      ...data,
      signatureComplete: true,
      signedDocumentUrl: signingData.signed_document_url,
      signedAt: signingData.signed_at,
      signTrustCompleted: true
    });
  };

  // Extract customer details from form data
  const customerDetails = {
    name: data.fullName || data.name || '',
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