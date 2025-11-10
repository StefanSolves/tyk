import React from 'react';
import { useFormState } from '../context/FormContext';
import { useFormContext } from 'react-hook-form';

import StepIndicator from './StepIndicator';
import Navigation from './Navigation';

// Import our step components
import Step1 from './Step1_Personal';
import Step2 from './Step2_Address'; // <-- 1. Import Step 2
// import Step3 from './Step3_Account';
// import Step4 from './Step4_Review';

const RegistrationWizard = () => {
  const { state } = useFormState();
  const { handleSubmit } = useFormContext();

  const onFinalSubmit = (data) => {
    console.log('Final Data:', data);
    // We'll add our axios POST request here
  };

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />; // <-- 2. Use the real component
      case 3:
        return <div>Step 3: Account Setup (Coming Soon)</div>;
      case 4:
        return <div>Step 4: Review (Coming Soon)</div>;
      default:
        return <Step1 />;
    }
  };

  return (
    <div className="wizard-container">
      <StepIndicator />
      <form onSubmit={handleSubmit(onFinalSubmit)} noValidate>
        {renderStep()}
        <Navigation />
      </form>
    </div>
  );
};

export default RegistrationWizard;