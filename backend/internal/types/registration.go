package types

type RegistrationPayload struct {
	// Step 1: Personal
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Phone     string `json:"phone,omitempty"`

	// Step 2: Address
	StreetAddress string `json:"streetAddress"`
	City          string `json:"city"`
	State         string `json:"state"`
	Country       string `json:"country"`

	// Step 3: Account
	Username            string `json:"username"`
	Password            string `json:"password"`
	ConfirmPassword     string `json:"confirmPassword"`
	AcceptTerms         bool   `json:"acceptTerms"`
	SubscribeNewsletter bool   `json:"subscribeNewsletter"`
}
