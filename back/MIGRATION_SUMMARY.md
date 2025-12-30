# Backend Migration to PostgreSQL - Summary

## Overview
The backend has been successfully migrated from JSON file-based storage to PostgreSQL database.

## Files Created

### Configuration Files
- **`config/database.js`** - PostgreSQL connection pool configuration
- **`.env`** - Environment variables for database connection and JWT secrets

### Database Models
- **`model/userModel.js`** - User database operations (CRUD)
- **`model/etudiantModel.js`** - Student-specific database operations
- **`model/enseignantModel.js`** - Teacher-specific database operations

### Routes
- **`routes/api.js`** - New API routes for `/api/signup` and `/api/login`

### Documentation
- **`database_schema.sql`** - Complete database schema with all tables
- **`DATABASE_SETUP.md`** - Setup instructions
- **`test-db-connection.js`** - Database connection test script

## Files Modified

### Controllers
- **`controllers/registerController.js`**
  - Replaced JSON file operations with database queries
  - Now handles both student and teacher registration
  - Uses `etudiantModel` and `enseignantModel` for role-specific data

- **`controllers/authController.js`**
  - Updated to query PostgreSQL database
  - Returns user details with role information
  - Supports both student and teacher login

- **`controllers/logoutController.js`**
  - Simplified (no longer stores refresh tokens in database)

- **`controllers/refreshTokenController.js`**
  - Updated to validate tokens via JWT verification
  - Fetches user data from database for token refresh

### Configuration
- **`config/allowedOrigins.js`**
  - Added frontend ports (5173, 5000)

- **`server.js`**
  - Changed default port from 3500 to 5000
  - Added `/api` route

## Database Schema

The PostgreSQL database includes these tables:

### Core Tables
1. **USER** - Base user information (id, nom, prenom, dateNaissance, email, motDePasse)
2. **ETUDIANT** - Student extension (idUser, Specialite, Annee)
3. **ENSEIGNANT** - Teacher extension (idUser, Specialite, Grade)
4. **COURS** - Courses (idCours, Nom, Module, idEnseignant)
5. **EXERCICE** - Exercises (idExercice, Contenu, Difficulte, Type, idEnseignant)
6. **SOLUTION** - Exercise solutions (idSolution, Contenu, idExercice)
7. **FEEDBACK** - User feedback (idFeedback, Avis, idUser)

### Junction Tables
8. **ETUDIANT_EXERCICE** - Student-Exercise relationship
9. **ETUDIANT_COURS** - Student-Course relationship with tracking data
10. **USER_FEEDBACK** - User-Feedback relationship

## API Changes

### New Endpoints
- `POST /api/signup` - Register new user (student or teacher)
- `POST /api/login` - Login and get JWT token

### Request Format Changes

**Signup** (was: `{user, pwd}`, now: `{nom, prenom, dateNaissance, email, motDePasse, userType, specialite, annee/grade}`)

```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "dateNaissance": "2000-01-15",
  "email": "jean.dupont@example.com",
  "motDePasse": "securePassword123",
  "userType": "etudiant",
  "specialite": "Informatique",
  "annee": "1"
}
```

**Login** (was: `{user, pwd}`, now: `{email, motDePasse}`)

```json
{
  "email": "jean.dupont@example.com",
  "motDePasse": "securePassword123"
}
```

### Response Format

**Login Success Response:**
```json
{
  "success": true,
  "accessToken": "jwt_token_here",
  "user": {
    "idUser": 1,
    "Nom": "Dupont",
    "Prenom": "Jean",
    "Email": "jean.dupont@example.com",
    "Specialite": "Informatique",
    "Annee": 1,
    "role": "etudiant"
  }
}
```

## Setup Steps

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Create PostgreSQL Database:**
   ```bash
   psql -U postgres -c "CREATE DATABASE algomaster;"
   ```

3. **Run Database Schema:**
   ```bash
   psql -U postgres -d algomaster -f database_schema.sql
   ```

4. **Configure Environment:**
   - Update `.env` with your PostgreSQL password

5. **Test Database Connection:**
   ```bash
   node test-db-connection.js
   ```

6. **Start Server:**
   ```bash
   npm run dev
   ```

## Environment Variables Required

```env
# JWT Secrets (change these in production!)
ACCESS_TOKEN_SECRET=your_access_token_secret_key_here_change_in_production
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key_here_change_in_production

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=algomaster

# Server Port (optional)
PORT=5000
```

## Breaking Changes

1. **Authentication endpoints now expect different field names:**
   - `user` → `email`
   - `pwd` → `motDePasse`

2. **Registration requires more fields:**
   - Must specify `userType` (etudiant/enseignant)
   - Must provide role-specific data (specialite, annee/grade)

3. **Server port changed:**
   - Default port is now 5000 (was 3500)

4. **User storage:**
   - No longer uses `model/users.json`
   - All data stored in PostgreSQL

## Security Improvements

1. JWT tokens have longer expiration times (24h for access, 7d for refresh)
2. Passwords hashed with bcrypt (salt rounds: 10)
3. Database credentials stored in environment variables
4. Proper CORS configuration
5. HTTP-only cookies for refresh tokens

## Testing

To test the connection:
```bash
node test-db-connection.js
```

To test API endpoints:
```bash
# Register a student
curl -X POST http://localhost:5000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prenom": "User",
    "dateNaissance": "2000-01-01",
    "email": "test@example.com",
    "motDePasse": "password123",
    "userType": "etudiant",
    "specialite": "Informatique",
    "annee": "1"
  }'

# Login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "motDePasse": "password123"
  }'
```

## Next Steps

1. Update frontend to use new API endpoints
2. Implement additional CRUD operations for courses and exercises
3. Add data validation middleware
4. Implement proper error handling
5. Add database migrations system
6. Set up database backups
7. Add API rate limiting
8. Implement refresh token rotation

## Rollback

If you need to rollback to the JSON file system:
1. Checkout the previous commit
2. Restore the `model/users.json` file
3. Change the PORT back to 3500 in server.js
