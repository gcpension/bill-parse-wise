import { Layout } from '@/components/Layout';
import { WizardProvider } from '@/contexts/WizardContext';
import { StepWizard } from '@/components/wizard/StepWizard';

const SwitchWizard = () => {
  return (
    <Layout>
      <WizardProvider>
        <StepWizard />
      </WizardProvider>
    </Layout>
  );
};

export default SwitchWizard;