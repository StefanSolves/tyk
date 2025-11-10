import React from 'react';
import { useFormState } from '../context/FormContext';
import { useFormContext } from 'react-hook-form'; 
import StepIndicator from './StepIndicator'; // new components imported
import Navigation from './Navigation'; // new components imported

// We'll create these step components next
// import Step1 from './Step1_Personal';
// import Step2 from './Step2_Address';
// import Step3 from './Step3_Account';
// import Step4 from './Step4_Review';

const RegistrationWizard = () => {
  const { state } = useFormState();
  const { handleSubmit } = useFormContext(); // Get RHF's handleSubmit

  // This is where we will POST to the API
  const onFinalSubmit = (data) => {
    console.log('Final Data:', data);
    // We'll add our axios POST request here
  };

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
      {/* Add the StepIndicator */}
      <StepIndicator />

      {/* This form tag now uses RHF's handleSubmit.
        It will *only* call onFinalSubmit if all fields are valid.
        The "Submit" button in <Navigation> will trigger this.
      */}
      <form onSubmit={handleSubmit(onFinalSubmit)} noValidate>
        {renderStep()}
        
        {/* Add the Navigation buttons */}
        <Navigation />
      </form>
    </div>
  );
};

export default RegistrationWizard;