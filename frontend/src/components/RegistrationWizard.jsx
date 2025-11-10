import React from 'react';
import { useFormState } from '../context/FormContext';
import { useFormContext } from 'react-hook-form';

import StepIndicator from './StepIndicator';
import Navigation from './Navigation';

// Import your new Step 1 component
import Step1 from './Step1_Personal'; 
// import Step2 from './Step2_Address';
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
        return <Step1 />; // Render Step1 component
      case 2:
        return <div>Step 2: Address Details (Coming Soon)</div>;
      case 3:
        return <div>Step 3: Account Setup (Coming Soon)</div>;
      case 4:
        return <div>Step 4: Review (Coming Soon)</div>;
      default:
        return <Step1 />; // Step1 component as fallback
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