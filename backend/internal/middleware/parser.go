package middleware

import (
	"encoding/json"
	"net/http"

	"github.com/StefanSolves/tyk/backend/internal/errors"
	"github.com/StefanSolves/tyk/backend/internal/types"
)

func ParseRegistrationJSON(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var payload types.RegistrationPayload

		err := json.NewDecoder(r.Body).Decode(&payload)
		if err != nil {
			errors.RespondWithError(w, http.StatusBadRequest, "Invalid JSON payload")
			return
		}

		ctx := CtxSavePayload(r.Context(), &payload)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}