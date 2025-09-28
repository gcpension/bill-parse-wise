import React from 'react';
import { ServiceRequestFormData } from '@/types/serviceRequest';

// Import sector-specific components
import CellularFields from './sector-fields/CellularFields';
import InternetISPFields from './sector-fields/InternetISPFields';
import InternetInfraFields from './sector-fields/InternetInfraFields';
import TVFields from './sector-fields/TVFields';
import ElectricityFields from './sector-fields/ElectricityFields';

interface SectorSpecificStepProps {
  formData: Partial<ServiceRequestFormData>;
  updateFormData: (data: Partial<ServiceRequestFormData>) => void;
}

export default function SectorSpecificStep({ formData, updateFormData }: SectorSpecificStepProps) {
  const renderSectorFields = () => {
    switch (formData.sector) {
      case 'cellular':
        return (
          <CellularFields
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 'internet_isp':
        return (
          <InternetISPFields
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 'internet_infra':
        return (
          <InternetInfraFields
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 'tv':
        return (
          <TVFields
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 'electricity':
        return (
          <ElectricityFields
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      default:
        return (
          <div className="text-center p-8 text-muted-foreground">
            אנא בחר תחום שירות בשלב הראשון
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">פרטים ייעודיים</h2>
        <p className="text-gray-600">מידע ספציפי לתחום השירות שנבחר</p>
      </div>
      {renderSectorFields()}
    </div>
  );
}