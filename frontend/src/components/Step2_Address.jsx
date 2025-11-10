import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useFormState } from '../context/FormContext';
import FormInput from './FormInput';

const Step2_Address = () => {
  // We use these hooks to manage state *both* in RHF and our context
  const { register, formState: { errors } } = useFormContext();
  const { state, dispatch } = useFormState();

  // Helper function for dropdowns
  const handleChange = (e) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: { field: e.target.name, value: e.target.value },
    });
  };

  // Mock data for dropdowns.
  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'UK', name: 'United Kingdom' },
  ];

  const states = {
    US: ['California', 'New York', 'Texas'],
    CA: ['Ontario', 'Quebec', 'British Columbia'],
    UK: ['England', 'Scotland', 'Wales'],
  };

  return (
    <div className="step-container">
      <h3>Address Details</h3>
      <FormInput
        name="streetAddress"
        label="Street Address"
        validation={{ required: 'Street Address is required' }}
      />
      <FormInput
        name="city"
        label="City"
        validation={{ required: 'City is required' }}
      />

      {/* Country Dropdown */}
      <div className="form-field">
        <label htmlFor="country">Country</label>
        <select
          id="country"
          name="country"
          value={state.country}
          {...register('country', { required: 'Country is required' })}
          onChange={handleChange}
        >
          <option value="">Select a country...</option>
          {countries.map((country) => (
            <option key={country.code} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
        {errors.country && <span className="error">{errors.country.message}</span>}
      </div>

      {/* State/Province Dropdown (Dynamic) */}
      <div className="form-field">
        <label htmlFor="state">State/Province</label>
        <select
          id="state"
          name="state"
          value={state.state}
          {...register('state', { required: 'State/Province is required' })}
          onChange={handleChange}
          disabled={!state.country} // Disable until a country is selected
        >
          <option value="">Select a state/province...</option>
          {state.country &&
            states[countries.find(c => c.name === state.country)?.code]?.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
        </select>
        {errors.state && <span className="error">{errors.state.message}</span>}
      </div>
    </div>
  );
};

export default Step2_Address;