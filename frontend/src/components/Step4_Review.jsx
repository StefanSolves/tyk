import React from 'react';
import { useFormState } from '../context/FormContext';

const Step4_Review = () => {
  const { state } = useFormS<ctrl61>tate();

  return (
    <div className="step-container">
      <h3>Review Your Information</h3>
      
      {/* Personal Information */}
      <div className="review-section">
        <h4>Personal Information</h4>
        <p><strong>First Name:</strong> {state.firstName}</p>
        <p><strong>Last Name:</strong> {state.lastName}</p>
        <p><strong>Email:</strong> {state.email}</p>
        <p><strong>Phone:</strong> {state.phone || 'N/A'}</p>
      </div>

      {/* Address Details */}
      <div className="review-section">
        <h4>Address Details</h4>
        <p><strong>Street Address:</strong> {state.streetAddress}</p>
        <p><strong>City:</strong> {state.city}</p>
        <p><strong>State/Province:</strong> {state.state}</p>
        <p><strong>Country:</strong> {state.country}</p>
      </div>

      {/* Account Setup */}
      <div className="review-section">
        <h4>Account Setup</h4>
        <p><strong>Username:</strong> {state.username}</p>
        <p><strong>Subscribed to Newsletter:</strong> {state.subscribeNewsletter ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default Step4_Review;