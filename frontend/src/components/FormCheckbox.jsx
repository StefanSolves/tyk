import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useFormState } from '../context/FormContext';

const FormCheckbox = ({ name, label, validation }) => {
  const { register, formState: { errors } } = useFormContext();
  const { state, dispatch } = useFormState();

  const handleChange = (e) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: { field: name, value: e.target.checked },
    });
  };

  return (
    <div className="form-field-checkbox">
      <input
        type="checkbox"
        id={name}
        // Get the value from our global context state
        checked={state[name]}
        // Register the field with RHF
        {...register(name, validation)}
        // Update global context on change
        onChange={handleChange}
      />
      <label htmlFor={name}>{label}</label>
      {/* Show error message if it exists */}
      {errors[name] && <span className="error">{errors[name].message}</span>}
    </div>
  );
};

export default FormCheckbox;