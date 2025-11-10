import React from 'react';
import { useFormState } from '../context/FormContext';
import { useFormContext } from 'react-hook-form';

import StepIndicator from './StepIndicator';
import Navigation from './Navigation';

// Import all our step components
import Step1 from './Step1_Personal';
import Step2 from './Step2_Address';
import Step3 from './Step3_Account';
import Step4 from './Step4_Review'; // <-- 1. Import Step 4

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
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />; // <-- 2. Use the real component
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