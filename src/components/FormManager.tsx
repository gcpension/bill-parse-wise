import { DocumentRequirements } from '@/components/DocumentRequirements';
import { SavedForms } from '@/components/SavedForms';
import { LegalNotice } from '@/components/LegalNotice';

interface FormManagerProps {
  category: 'electricity' | 'cellular' | 'internet';
}

export const FormManager = ({ category }: FormManagerProps) => {

  return (
    <div className="space-y-6 animate-fade-in">
      <DocumentRequirements category={category} />
      <SavedForms category={category} />
      <LegalNotice />
    </div>
  );
};