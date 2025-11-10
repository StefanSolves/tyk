package models

import "time"

// User represents the data we store in the database.
type User struct {
	ID                  int64     `json:"id"`
	FirstName           string    `json:"firstName"`
	LastName            string    `json:"lastName"`
	Email               string    `json:"email"`
	Phone               string    `json:"phone,omitempty"`
	StreetAddress       string    `json:"streetAddress"`
	City                string    `json:"city"`
	State               string    `json:"state"`
	Country             string    `json:"country"`
	Username            string    `json:"username"`
	PasswordHash        string    `json:"-"` // Excluded from JSON responses for security
	SubscribeNewsletter bool      `json:"subscribeNewsletter"`
	CreatedAt           time.Time `json:"createdAt"`
	UpdatedAt           time.Time `json:"updatedAt"`
}
