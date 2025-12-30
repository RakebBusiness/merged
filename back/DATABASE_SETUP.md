# PostgreSQL Database Setup for AlgoMaster

## Prerequisites
- PostgreSQL installed on your machine
- PostgreSQL running on port 5432

## Setup Instructions

### 1. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE algomaster;

# Exit psql
\q
```

### 2. Run Database Schema
```bash
# Execute the schema file
psql -U postgres -d algomaster -f database_schema.sql
```

Or you can copy and paste the SQL commands from `database_schema.sql` into a PostgreSQL client.

### 3. Configure Environment Variables

Update the `.env` file with your PostgreSQL credentials:

```env
ACCESS_TOKEN_SECRET=your_access_token_secret_key_here_change_in_production
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key_here_change_in_production

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=algomaster
```

**Important:** Replace `your_postgres_password` with your actual PostgreSQL password.

### 4. Install Dependencies
```bash
npm install
```

### 5. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on port 5000 by default.

## API Endpoints

### Authentication
- **POST** `/api/signup` - Register a new user
  - Body: `{ nom, prenom, dateNaissance, email, motDePasse, userType, specialite, annee/grade }`

- **POST** `/api/login` - Login
  - Body: `{ email, motDePasse }`

- **GET** `/logout` - Logout

- **GET** `/refresh` - Refresh access token

## Database Tables

The schema includes the following tables:
- `USER` - Base user information
- `ETUDIANT` - Student-specific data
- `ENSEIGNANT` - Teacher-specific data
- `COURS` - Courses
- `EXERCICE` - Exercises
- `SOLUTION` - Solutions to exercises
- `FEEDBACK` - User feedback
- `ETUDIANT_EXERCICE` - Student-Exercise relationship
- `ETUDIANT_COURS` - Student-Course relationship
- `USER_FEEDBACK` - User-Feedback relationship

## Troubleshooting

### Connection Issues
If you encounter connection errors:
1. Verify PostgreSQL is running: `sudo service postgresql status`
2. Check your credentials in `.env`
3. Ensure the database exists: `psql -U postgres -l`

### Port Conflicts
If port 5000 is already in use, you can change it in:
- `.env` file: `PORT=3500`
- Or it will use the PORT environment variable

## Security Notes
- Change the JWT secrets in production
- Never commit your `.env` file to version control
- Use strong passwords for database users
- Consider using environment-specific configurations
