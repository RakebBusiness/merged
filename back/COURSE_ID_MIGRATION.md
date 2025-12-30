# Course ID Auto-Increment Migration

## Overview
This migration converts the `idCours` field in the COURS table from a manually-entered integer to an auto-incrementing SERIAL field.

## What Changed

### Database
- `idCours` now auto-generates using a PostgreSQL sequence
- Teachers no longer need to manually enter course IDs
- Existing courses maintain their current IDs
- The sequence starts from the highest existing ID + 1

### Backend
- `coursController.js`: Removed `idCours` from the create request body
- `coursModel.js`: Removed `idCours` from the INSERT query (database generates it)

### Frontend
- `CourseModal.tsx`: Removed the "ID du cours" input field from the form
- Course IDs are now automatically assigned by the database

## Running the Migration

**IMPORTANT:** Make sure your database is running before executing the migration.

### Step 1: Run the migration script
```bash
cd project/back
node run-cours-id-migration.js
```

### Step 2: Verify the migration
The migration will:
1. Find the maximum existing `idCours` value
2. Create or reset the sequence to start from max + 1
3. Set the column default to use the sequence

### Expected Output
```
Starting migration: Make Course ID Auto-Increment
Migration completed successfully!
Course IDs will now be auto-generated.
Done!
```

## How It Works Now

### Creating a Course (Teacher Panel)
1. Teacher fills in:
   - Title
   - Level (Algo1/Algo2)
   - Duration
   - Description
   - Topics
   - Sections
2. Database automatically assigns the next available ID
3. Teacher never sees or needs to manage IDs

### Example
**Before:**
- Teacher had to manually enter ID: 101, 102, 103...
- Risk of duplicate IDs or gaps

**After:**
- Database automatically assigns: 101 → 102 → 103...
- No manual input required
- No duplicate ID errors

## Rollback (if needed)
If you need to revert this change:

```sql
-- Remove the sequence default
ALTER TABLE "COURS" ALTER COLUMN "idCours" DROP DEFAULT;

-- Optionally drop the sequence
DROP SEQUENCE IF EXISTS cours_idcours_seq;
```

Note: After rollback, you'll need to revert the backend and frontend code changes as well.
