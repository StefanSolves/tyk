import React, { createContext, useReducer, useContext } from "react";
import { formReducer, initialState } from "./formReducer";

// 1. Create the context
const FormContext = createContext();

// 2. Create the Provider component
export const FormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};

// 3. Create a custom hook for easy access
export const useFormState = () => {
  return useContext(FormContext);
};