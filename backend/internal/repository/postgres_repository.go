package repository

import (
	"context"
	"database/sql"
	"time"

	"github.com/StefanSolves/tyk/backend/internal/models"
	"golang.org/x/crypto/bcrypt"
)

// PostgresRepository is the concrete implementation of UserRepository for PostgreSQL.
type PostgresRepository struct {
	DB *sql.DB
}

// NewPostgresRepository creates a new PostgresRepository.
func NewPostgresRepository(db *sql.DB) *PostgresRepository {
	return &PostgresRepository{DB: db}
}

// CreateUser hashes the password and inserts a new user into the database.
func (r *PostgresRepository) CreateUser(ctx context.Context, user *models.User) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.PasswordHash), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.PasswordHash = string(hashedPassword)

	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	query := `
		INSERT INTO users (
			first_name, last_name, email, phone, street_address, city, state, country, 
			username, password_hash, subscribe_newsletter, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
		RETURNING id
	`
	err = r.DB.QueryRowContext(ctx, query,
		user.FirstName, user.LastName, user.Email, user.Phone,
		user.StreetAddress, user.City, user.State, user.Country,
		user.Username, user.PasswordHash, user.SubscribeNewsletter,
		user.CreatedAt, user.UpdatedAt,
	).Scan(&user.ID)

	return err
}

// IsUsernameTaken checks if a username already exists.
func (r *PostgresRepository) IsUsernameTaken(ctx context.Context, username string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)`

	err := r.DB.QueryRowContext(ctx, query, username).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

// IsEmailTaken checks if an email already exists.
func (r *PostgresRepository) IsEmailTaken(ctx context.Context, email string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`

	err := r.DB.QueryRowContext(ctx, query, email).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}
