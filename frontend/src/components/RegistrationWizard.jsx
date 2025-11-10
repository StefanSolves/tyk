// src/components/RegistrationWizard.jsx
import React, { useState } from 'react'; // Import useState
import { useFormState } from '../context/FormContext';
import { useFormContext } from 'react-hook-form';
import axios from 'axios'; // Import axios

import StepIndicator from './StepIndicator';
import Navigation from './Navigation';

// Import all our step components
import Step1 from './Step1_Personal';
import Step2 from './Step2_Address';
import Step3 from './Step3_Account';
import Step4 from './Step4_Review';

const RegistrationWizard = () => {
  const { state, dispatch } = useFormState(); // Get dispatch
  const { handleSubmit, reset } = useFormContext(); // Get RHF's reset

  // States for API call feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // This is where we POST to the API
  const onFinalSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Send the data to your Go backend
      // We send 'data' from RHF, which has the complete form
      const response = await axios.post(
        'http://localhost:8080/api/register',
        data
      );

      // 2. Handle Success
      setSuccess(true);
      setLoading(false);
      console.log('Submission successful:', response.data);

      // 3. Reset all state
      reset(); // Resets React Hook Form
      dispatch({ type: 'RESET_FORM' }); // Resets our Context state
    } catch (err) {
      // 4. Handle Error
      setLoading(false);
      if (err.response && err.response.data && err.response.data.error) {
        // Use the specific error message from our Go backend
        setError(err.response.data.error);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Submission failed:', err);
    }
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
        return <Step4 />;
      default:
        return <Step1 />;
    }
  };

  // Show a success message and hide the form
  if (success) {
    return (
      <div className="wizard-container">
        <h3>Registration Successful!</h3>
        <p>Thank you for registering. You can now log in.</p>
      </div>
    );
  }

  // Show the form
  return (
    <div className="wizard-container">
      <StepIndicator />
      <form onSubmit={handleSubmit(onFinalSubmit)} noValidate>
        {/* Show API error message */}
        {error && <div className="error-message">{error}</div>}

        {/* Disable form while loading */}
        <fieldset disabled={loading}>
          {renderStep()}
          
          {/* Show loading text on buttons */}
          {loading ? (
            <div className="loading-message">Submitting...</div>
          ) : (
            <Navigation />
          )}
        </fieldset>
      </form>
    </div>
  );
};

export default RegistrationWizard;