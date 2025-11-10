package middleware

import (
	"net/http"
	"regexp"
	"strings"
	"unicode"
	"context"
	"github.com/StefanSolves/tyk/backend/internal/repository"

	"github.com/StefanSolves/tyk/backend/internal/errors"
)

// use simple regex patterns for email and phone validation
var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
var phoneRegex = regexp.MustCompile(`^(\+?1\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$`)

// ValidateRequiredFields checks for the presence of all required fields in the registration payload.
// If any required field is missing, it responds with a 422 status and details of the missing fields.
func ValidateRequiredFields(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		payload := CtxGetPayload(r.Context())
		fieldErrors := make(map[string]string)

		if payload.FirstName == "" {
			fieldErrors["firstName"] = "First Name is required"
		}
		if payload.LastName == "" {
			fieldErrors["lastName"] = "Last Name is required"
		}
		if payload.Email == "" {
			fieldErrors["email"] = "Email is required"
		}
		if payload.StreetAddress == "" {
			fieldErrors["streetAddress"] = "Street Address is required"
		}
		if payload.City == "" {
			fieldErrors["city"] = "City is required"
		}
		if payload.State == "" {
			fieldErrors["state"] = "State/Province is required"
		}
		if payload.Country == "" {
			fieldErrors["country"] = "Country is required"
		}
		if payload.Username == "" {
			fieldErrors["username"] = "Username is required"
		}
		if payload.Password == "" {
			fieldErrors["password"] = "Password is required"
		}
		if payload.ConfirmPassword == "" {
			fieldErrors["confirmPassword"] = "Confirm Password is required"
		}

		if len(fieldErrors) > 0 {
			reportFieldErrors(w, "One or more required fields are missing.", fieldErrors)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// ValidateFieldFormats checks the format of specific fields in the registration payload.
// If any field has an invalid format, it responds with a 422 status and details of the invalid fields.
func ValidateFieldFormats(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		payload := CtxGetPayload(r.Context())
		fieldErrors := make(map[string]string)

		if !emailRegex.MatchString(payload.Email) {
			fieldErrors["email"] = "Must be a valid email address"
		}

		if payload.Phone != "" && !phoneRegex.MatchString(payload.Phone) {
			fieldErrors["phone"] = "Must be a valid phone number format"
		}

		if len(fieldErrors) > 0 {
			reportFieldErrors(w, "One or more fields have an invalid format.", fieldErrors)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// ValidateUsername checks that the username meets minimum length requirements.
// If the username is too short, it responds with a 422 status and an appropriate error message.
func ValidateUsername(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		payload := CtxGetPayload(r.Context())
		// Username must be at least 6 characters long
		if len(payload.Username) < 6 {
			reportFieldErrors(w, "Username validation failed.", map[string]string{
				"username": "Username must be at least 6 characters long",
			})
			return
		}
		next.ServeHTTP(w, r)
	})
}

// ValidatePasswordStrength checks that the password meets complexity requirements.
// If the password is too weak, it responds with a 422 status and an appropriate error message.
func ValidatePasswordStrength(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		payload := CtxGetPayload(r.Context())
		pass := payload.Password
		// Password must be at least 8 characters long and include uppercase, lowercase, number, and special character
		if len(pass) < 8 {
			reportPasswordError(w, "Password must be at least 8 characters long.")
			return
		}

		var (
			hasUpper   bool
			hasLower   bool
			hasNumber  bool
			hasSpecial bool
		)
		// Check each character in the password to determine its type

		for _, char := range pass {
			switch {
			case unicode.IsUpper(char):
				hasUpper = true
			case unicode.IsLower(char):
				hasLower = true
			case unicode.IsDigit(char):
				hasNumber = true
			case unicode.IsPunct(char) || unicode.IsSymbol(char):
				hasSpecial = true
			}
		}
		// Validate presence of each character type
		// If any type is missing, report an error
		if !hasUpper {
			reportPasswordError(w, "Password must include at least one uppercase letter.")
			return
		}
		if !hasLower {
			reportPasswordError(w, "Password must include at least one lowercase letter.")
			return
		}
		if !hasNumber {
			reportPasswordError(w, "Password must include at least one number.")
			return
		}
		if !hasSpecial {
			reportPasswordError(w, "Password must include at least one special character.")
			return
		}

		next.ServeHTTP(w, r)
	})
}

// ValidatePasswordsMatch checks that the password and confirm password fields match.
// If they do not match, it responds with a 422 status and an appropriate error message.
func ValidatePasswordsMatch(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		payload := CtxGetPayload(r.Context())

		if payload.Password != payload.ConfirmPassword {
			reportFieldErrors(w, "Passwords do not match.", map[string]string{
				"confirmPassword": "Passwords do not match",
			})
			return
		}

		next.ServeHTTP(w, r)
	})
}

// ValidateTermsAccepted checks that the user has accepted the terms and conditions.
// If not accepted, it responds with a 422 status and an appropriate error message.
func ValidateTermsAccepted(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		payload := CtxGetPayload(r.Context())

		if !payload.AcceptTerms {
			reportFieldErrors(w, "Terms must be accepted.", map[string]string{
				"acceptTerms": "You must accept the terms and conditions",
			})
			return
		}

		next.ServeHTTP(w, r)
	})
}

// ValidateBonusCountryEmail checks that the email domain matches the country for bonus eligibility.
//
//	If the email domain does not match the country, it responds with a 422 status and an appropriate error message.
func ValidateBonusCountryEmail(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		payload := CtxGetPayload(r.Context())

		email := strings.ToLower(payload.Email)
		country := strings.ToUpper(payload.Country)

		switch country {
		case "UK", "UNITED KINGDOM":
			if !strings.HasSuffix(email, ".uk") {
				reportFieldErrors(w, "Email does not match country.", map[string]string{
					"email": "For UK, email domain must end in .uk",
				})
				return
			}
		case "US", "USA", "UNITED STATES":
			if !strings.HasSuffix(email, ".com") && !strings.HasSuffix(email, ".us") {
				reportFieldErrors(w, "Email does not match country.", map[string]string{
					"email": "For US, email domain must end in .com or .us",
				})
				return
			}
		}

		next.ServeHTTP(w, r)
	})
}

// reportFieldErrors is a helper function to send a standardised error response for field validation issues.
func reportFieldErrors(w http.ResponseWriter, globalMsg string, fields map[string]string) {
	errResp := errors.APIError{
		Error:  globalMsg,
		Fields: fields,
	}
	errors.RespondWithJSON(w, http.StatusUnprocessableEntity, errResp)
}

// reportPasswordError is a helper function to send a standardised error response for password validation issues.
func reportPasswordError(w http.ResponseWriter, message string) {
	reportFieldErrors(w, "Password validation failed.", map[string]string{
		"password": message,
	})
}



// CheckUsernameAvailability creates a middleware that checks if the username is taken.
func CheckUsernameAvailability(repo repository.UserRepository) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			payload := CtxGetPayload(r.Context())

			taken, err := repo.IsUsernameTaken(r.Context(), payload.Username)
			if err != nil {
				errors.RespondWithError(w, http.StatusInternalServerError, "Error checking username")
				return
			}

			if taken {
				reportFieldErrors(w, "Username is not available.", map[string]string{
					"username": "This username is already taken",
				})
				return // Stop the chain
			}

			next.ServeHTTP(w, r)
		})
	}
}

// CheckEmailAvailability creates a middleware that checks if the email is taken.
func CheckEmailAvailability(repo repository.UserRepository) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			payload := CtxGetPayload(r.Context())

			taken, err := repo.IsEmailTaken(r.Context(), payload.Email)
			if err != nil {
				errors.RespondWithError(w, http.StatusInternalServerError, "Error checking email")
				return
			}

			if taken {
				reportFieldErrors(w, "Email is not available.", map[string]string{
					"email": "An account with this email already exists",
				})
				return // Stop the chain
			}

			next.ServeHTTP(w, r)
		})
	}
}