import React from 'react';
import FormInput from './FormInput';

const Step1_Personal = () => {
  return (
    <div className="step-container">
      <h3>Personal Information</h3>
      <FormInput
        name="firstName"
        label="First Name"
        validation={{ required: 'First Name is required' }}
      />
      <FormInput
        name="lastName"
        label="Last Name"
        validation={{ required: 'Last Name is required' }}
      />
      <FormInput
        name="email"
        label="Email"
        type="email"
        validation={{
          required: 'Email is required',
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: 'Must be a valid email address',
          },
        }}
      />
      <FormInput
        name="phone"
        label="Phone Number (Optional)"
        type="tel"
        validation={{
          pattern: {
            // This regex validates only if a value is provided
            value: /^(\+?1\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
            message: 'Must be a valid phone number',
          },
        }}
      />
    </div>
  );
};

export default Step1_Personal;