import React from 'react';
import { useFormState } from '../context/FormContext';

// We'll create and import these step components next
// import Step1 from './Step1_Personal';
// import Step2 from './Step2_Address';
// import Step3 from './Step3_Account';
// import Step4 from './Step4_Review';

const RegistrationWizard = () => {
  // Get the current step from our FormContext
  const { state } = useFormState();

  const renderStep = () => {
    switch (state.step) {
      case 1:
        // return <Step1 />;
        return <div>Step 1: Personal Information (Coming Soon)</div>;
      case 2:
        // return <Step2 />;
        return <div>Step 2: Address Details (Coming Soon)</div>;
      case 3:
        // return <Step3 />;
        return <div>Step 3: Account Setup (Coming Soon)</div>;
      case 4:
        // return <Step4 />;
        return <div>Step 4: Review (Coming Soon)</div>;
      default:
        return <div>Step 1: Personal Information (Coming Soon)</div>;
    }
  };

  return (
    <div className="wizard-container">
      <h2>Registration - Step {state.step}</h2>
      <form>
        {/* Render the current step */}
        {renderStep()}
      </form>
    </div>
  );
};

export default RegistrationWizard;