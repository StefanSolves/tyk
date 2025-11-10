package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors" // Import cors
	"github.com/joho/godotenv"

	// Import all our packages
	"github.com/StefanSolves/tyk/backend/internal/database"
	"github.com/StefanSolves/tyk/backend/internal/handlers"
	mw "github.com/StefanSolves/tyk/backend/internal/middleware"
	"github.com/StefanSolves/tyk/backend/internal/repository"
)
// Main entry point of the application.
func main() {
	// 1. Load .env file
	_ = godotenv.Load()

	// 2. Read Database Config from Environment
	dbConfig := database.Config{
		User:     os.Getenv("DB_USER"),
		Password: os.Getenv("DB_PASSWORD"),
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
		DBName:   os.Getenv("DB_NAME"),
	}

	// 3. Connect to the Database
	db, err := database.Connect(dbConfig)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// 4. Initialise Database Tables
	if err := database.InitTables(db); err != nil {
		log.Fatalf("Failed to initialize database tables: %v", err)
	}

	// 5. Create Repository
	repo := repository.NewPostgresRepository(db)

	// 6. Create API Handlers
	api := handlers.NewAPI(repo)

	// 7. Setup Router
	r := chi.NewRouter()

	// 8. Configure CORS Middleware
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // React app's URL
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Heartbeat("/health"))

	// --- API Routes ---
	r.Route("/api", func(r chi.Router) {

		// The full validation chain
		r.With(
			mw.ParseRegistrationJSON,
			mw.ValidateRequiredFields,
			mw.ValidateFieldFormats,
			mw.ValidateUsername,
			mw.ValidatePasswordStrength,
			mw.ValidatePasswordsMatch,
			mw.ValidateTermsAccepted,
			mw.ValidateBonusCountryEmail, // (Bonus)
			mw.CheckUsernameAvailability(repo),
			mw.CheckEmailAvailability(repo),
		).Post("/register", api.RegisterUser)

		r.Get("/check-username", api.CheckUsername)
	})

	log.Println("Server starting on :8080...")
	http.ListenAndServe(":8080", r)
}