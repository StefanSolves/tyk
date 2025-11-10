package errors

import (
	"encoding/json"
	"net/http"
)

type APIError struct {
	Error  string            `json:"error"`
	Fields map[string]string `json:"fields,omitempty"`
}

func RespondWithError(w http.ResponseWriter, code int, message string) {
	RespondWithJSON(w, code, APIError{Error: message})
}

func RespondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}
