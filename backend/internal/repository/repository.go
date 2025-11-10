package repository

import (
	"context"

	"github.com/StefanSolves/tyk/backend/internal/models"
)

// UserRepository is the "contract" for our user persistence.
// It defines *what* we can do, not *how* we do it.
type UserRepository interface {
	// CreateUser inserts a new user into the database.
	CreateUser(ctx context.Context, user *models.User) error

	// IsUsernameTaken checks if a username already exists.
	IsUsernameTaken(ctx context.Context, username string) (bool, error)

	// IsEmailTaken checks if an email already exists.
	IsEmailTaken(ctx context.Context, email string) (bool, error)
}
