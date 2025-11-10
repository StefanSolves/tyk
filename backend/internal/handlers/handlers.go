package handlers

import (
	// "encoding/json"
	"net/http"

	"github.com/StefanSolves/tyk/backend/internal/errors"
	"github.com/StefanSolves/tyk/backend/internal/models"
	mw "github.com/StefanSolves/tyk/backend/internal/middleware"
	"github.com/StefanSolves/tyk/backend/internal/repository"
	// "github.com/StefanSolves/tyk/backend/internal/types"
)

// API holds the dependencies for our handlers (like the repository).
type API struct {
	Repo repository.UserRepository
}

// NewAPI creates a new API struct with its dependencies.
func NewAPI(repo repository.UserRepository) *API {
	return &API{Repo: repo}
}

// RegisterUser is the final handler in our chain.
func (api *API) RegisterUser(w http.ResponseWriter, r *http.Request) {
	// 1. Get the validated payload from the context
	payload := mw.CtxGetPayload(r.Context())

	// 2. Map the payload to our database model
	user := &models.User{
		FirstName:           payload.FirstName,
		LastName:            payload.LastName,
		Email:               payload.Email,
		Phone:               payload.Phone,
		StreetAddress:       payload.StreetAddress,
		City:                payload.City,
		State:               payload.State,
		Country:             payload.Country,
		Username:            payload.Username,
		PasswordHash:        payload.Password, // The Repo will hash this
		SubscribeNewsletter: payload.SubscribeNewsletter,
	}

	// 3. Create the user in the database
	err := api.Repo.CreateUser(r.Context(), user)
	if err != nil {
		errors.RespondWithError(w, http.StatusInternalServerError, "Failed to create user")
		return
	}

	// 4. Send the successful response
	resp := map[string]interface{}{
		"message": "User registered successfully",
		"userId":  user.ID,
	}
	errors.RespondWithJSON(w, http.StatusCreated, resp)
}

// CheckUsername checks if a username is available.
func (api *API) CheckUsername(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("username")
	if username == "" {
		errors.RespondWithError(w, http.StatusBadRequest, "Username query parameter is required")
		return
	}
// Check if the username is taken
	taken, err := api.Repo.IsUsernameTaken(r.Context(), username)
	if err != nil {
		errors.RespondWithError(w, http.StatusInternalServerError, "Error checking username")
		return
	}

	resp := map[string]bool{"available": !taken}
	errors.RespondWithJSON(w, http.StatusOK, resp)
}