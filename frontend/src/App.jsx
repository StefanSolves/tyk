import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import RegistrationWizard from './components/RegistrationWizard';
import './index.css';

function App() {
  // 1. Initialize React Hook Form
  const methods = useForm({
    mode: 'onTouched', // Validate fields when the user clicks out of them
  });

  return (
    <div className="app-container">
      {/* 2. The FormProvider passes RHF methods to all child components */}
      <FormProvider {...methods}>
        <RegistrationWizard />
      </FormProvider>
    </div>
  );
}

export default App;