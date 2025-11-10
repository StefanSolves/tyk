// This is the initial state, the "blueprint" of our form.
export const initialState = {
    step: 1,
  
    // Step 1
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  
    // Step 2
    streetAddress: "",
    city: "",
    state: "",
    country: "",
  
    // Step 3
    username: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    subscribeNewsletter: false,
  };
  
  // The reducer function handles all state changes
  export const formReducer = (state, action) => {
    switch (action.type) {
      case "UPDATE_FIELD":
        return {
          ...state,
          [action.payload.field]: action.payload.value,
        };
      case "NEXT_STEP":
        return {
          ...state,
          step: state.step + 1,
        };
      case "PREV_STEP":
        return {
          ...state,
          step: state.step - 1,
        };
      case "RESET_FORM":
        return initialState;
      default:
        return state;
    }
  };