import React from 'react';
import { useFormContext } from 'react-hook-form';
import axios from 'axios';
import FormInput from './FormInput';
import FormCheckbox from './FormCheckbox';

const Step3_Account = () => {
  const { getValues } = useFormContext(); // We need this to get the password value

  // This is our async validation function for the username
  const checkUsernameAvailability = async (username) => {
    if (username.length < 6) return true; // Don't check if it's too short
    try {
      // Call our Go backend!
      const response = await axios.get(
        `http://localhost:8080/api/check-username?username=${username}`
      );
      // Return true if available, or the error message if not
      return response.data.available || 'This username is already taken.';
    } catch (error) {
      return 'Could not verify username.'; // Handle server error
    }
  };

  return (
    <div className="step-container">
      <h3>Account Setup</h3>
      <FormInput
        name="username"
        label="Username"
        validation={{
          required: 'Username is required',
          minLength: {
            value: 6,
            message: 'Username must be at least 6 characters',
          },
          // Async validation to check availability
          validate: checkUsernameAvailability,
        }}
      />
      <FormInput
        name="password"
        label="Password"
        type="password"
        validation={{
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters',
          },
          // Regex for password strength
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
            message: 'Must include uppercase, lowercase, number, and special character.',
          },
        }}
      />
      <FormInput
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        validation={{
          required: 'Please confirm your password',
          // This is the cross-field validation
          validate: (value) =>
            value === getValues('password') || 'Passwords do not match',
        }}
      />
      <FormCheckbox
        name="acceptTerms"
        label="I accept the Terms and Conditions"
        validation={{
          required: 'You must accept the terms and conditions',
        }}
      />
      <FormCheckbox
        name="subscribeNewsletter"
        label="Subscribe to newsletter (Optional)"
      />
    </div>
  );
};

export default Step3_Account;