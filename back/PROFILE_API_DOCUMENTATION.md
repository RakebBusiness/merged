# Profile API Documentation

## Overview
The Profile API allows students to view their learning progress, including enrolled courses, completed exercises, level, XP, and unlocked achievements.

## Database Migration
Before using the profile endpoints, you need to run the database migration to add the necessary tables and fields:

```bash
cd project/back
node run-migration.js
```

This will add:
- Progress tracking fields to `ETUDIANT_COURS` and `ETUDIANT_EXERCICE` tables
- Level and XP fields to `ETUDIANT` table
- `ACHIEVEMENT` table with predefined achievements
- `STUDENT_ACHIEVEMENT` table to track unlocked achievements

## Endpoints

### 1. Get Student Progress
**GET** `/profile`

Returns comprehensive progress information for the authenticated student.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "profile": {
    "idUser": 1,
    "nom": "Doe",
    "prenom": "John",
    "email": "john.doe@example.com",
    "dateNaissance": "2000-01-15",
    "specialite": "Computer Science",
    "annee": 2,
    "level": 5,
    "xp": 450,
    "xpToNextLevel": 50
  },
  "statistics": {
    "totalCoursesEnrolled": 3,
    "coursesCompleted": 1,
    "totalExercisesEnrolled": 15,
    "exercisesCompleted": 10,
    "averageScore": "85.50",
    "progressPercentage": 67
  },
  "courses": {
    "completed": [...],
    "inProgress": [...]
  },
  "exercises": {
    "completed": [...],
    "inProgress": [...]
  },
  "achievements": {
    "unlocked": [
      {
        "idAchievement": 1,
        "name": "First Steps",
        "description": "Complete your first exercise",
        "icon": "🎯",
        "xpReward": 50,
        "unlockedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "locked": [...],
    "totalUnlocked": 3,
    "totalAvailable": 7
  }
}
```

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not a student account
- `404 Not Found` - Student profile not found
- `500 Internal Server Error` - Server error

---

### 2. Mark Exercise as Complete
**POST** `/profile/exercises/:id/complete`

Marks an exercise as completed and awards XP to the student.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**URL Parameters:**
- `id` - Exercise ID

**Request Body:**
```json
{
  "score": 85
}
```

**Response:**
```json
{
  "message": "Exercise marked as complete",
  "xpGained": 10
}
```

**Features:**
- Awards 10 XP for completing an exercise
- Automatically checks and unlocks achievements
- Updates student level if enough XP is gained

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not a student account
- `500 Internal Server Error` - Server error

---

### 3. Mark Course as Complete
**POST** `/profile/courses/:id/complete`

Marks a course as completed and awards XP to the student.

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `id` - Course ID

**Response:**
```json
{
  "message": "Course marked as complete",
  "xpGained": 50
}
```

**Features:**
- Awards 50 XP for completing a course
- Sets course progress to 100%
- Automatically checks and unlocks achievements
- Updates student level if enough XP is gained

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not a student account
- `500 Internal Server Error` - Server error

---

## Achievements System

The system includes 7 predefined achievements:

1. **First Steps** (50 XP) - Complete your first exercise
2. **Course Explorer** (30 XP) - Enroll in your first course
3. **Quick Learner** (100 XP) - Complete 5 exercises
4. **Dedicated Student** (200 XP) - Complete 10 exercises
5. **Course Master** (150 XP) - Complete your first course
6. **Algorithm Expert** (500 XP) - Complete 20 exercises
7. **Consistency King** (300 XP) - Complete 3 courses

Achievements are automatically unlocked when conditions are met, and the associated XP reward is added to the student's total.

## Level System

- Students start at level 1 with 0 XP
- Each level requires 100 XP (Level 1 = 0-99 XP, Level 2 = 100-199 XP, etc.)
- XP is earned by:
  - Completing exercises: 10 XP
  - Completing courses: 50 XP
  - Unlocking achievements: Variable XP based on achievement

## Authorization

All profile endpoints require:
- Valid JWT token in Authorization header
- Student role (etudiant)

Teachers and admins cannot access profile endpoints as they are specific to student progress tracking.
