import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useFormState } from '../context/FormContext';

const FormInput = ({ name, label, validation, type = 'text' }) => {
  const { register, formState: { errors } } = useFormContext();
  const { state, dispatch } = useFormState();

  const handleChange = (e) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: { field: name, value: e.target.value },
    });
  };

  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        // Get the value from our global context state
        value={state[name]} 
        // Register the field with RHF, including validation rules
        {...register(name, validation)} 
        // Update global context on change
        onChange={handleChange} 
      />
      {/* Show error message if it exists */}
      {errors[name] && <span className="error">{errors[name].message}</span>}
    </div>
  );
};

export default FormInput;