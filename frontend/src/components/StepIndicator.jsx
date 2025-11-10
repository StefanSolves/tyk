import React from 'react';
import { useFormState } from '../context/FormContext';

const StepIndicator = () => {
  const { state } = useFormState();
  const steps = [
    { number: 1, title: 'Personal' },
    { number: 2, title: 'Address' },
    { number: 3, title: 'Account' },
    { number: 4, title: 'Review' },
  ];

  // We'll add basic CSS for this later in index.css
  return (
    <div className="step-indicator">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`step ${state.step === step.number ? 'active' : ''} ${
            state.step > step.number ? 'completed' : ''
          }`}
        >
          <div className="step-number">{step.number}</div>
          <div className="step-title">{step.title}</div>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;