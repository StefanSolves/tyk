import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useFormState } from '../context/FormContext';

const Navigation = () => {
  const { state, dispatch } = useFormState();
  const { trigger } = useFormContext(); // Get RHF's trigger function

  const handleNext = async () => {
    // Validate fields for the current step before proceeding
    let isValid = false;
    
    // We need to tell RHF *which* fields to validate
    if (state.step === 1) {
      isValid = await trigger(['firstName', 'lastName', 'email']);
    } else if (state.step === 2) {
      isValid = await trigger(['streetAddress', 'city', 'state', 'country']);
    } else if (state.step === 3) {
      isValid = await trigger(['username', 'password', 'confirmPassword', 'acceptTerms']);
    }

    if (isValid) {
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  const handlePrev = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  return (
    <div className="navigation-buttons">
      {state.step > 1 && (
        <button type="button" onClick={handlePrev}>
          Previous
        </button>
      )}

      {state.step < 4 && (
        <button type="button" onClick={handleNext}>
          Next
        </button>
      )}

      {state.step === 4 && (
        <button type="submit">
          Submit
        </button>
      )}
    </div>
  );
};

export default Navigation;