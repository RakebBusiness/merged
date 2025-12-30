# Enrollment System Documentation

## Overview
The enrollment system allows students to enroll in courses, track their progress, and complete courses. Users can view basic course information without enrolling, but must enroll to access full course content.

## Features

### 1. Course Enrollment
- Students must enroll to access full course content (sections with theory and code examples)
- Non-enrolled users can view:
  - Course title, level, description, and duration
  - Topics covered
  - Course outline (section titles only)
- Enrollment creates a record with:
  - Start date (`enrolledAt`)
  - Progress tracking (0-100%)
  - Completion status

### 2. Content Access Control
- **Before Enrollment**: Users see course outline with locked indicators
- **After Enrollment**: Full access to all sections with theory and code examples
- **Backend**: `coursModel.findById()` checks enrollment status and filters content accordingly

### 3. Progress Tracking
- Progress can be updated (0-100%) while course is in progress
- Progress bar displayed on course detail page
- Linked to existing progress tracking system in database

### 4. Course Completion
- "Mark as Complete" button for enrolled students
- Sets:
  - `completed` = TRUE
  - `finishedAt` = current timestamp
  - `progress` = 100%
- Displays completion date on course detail page

## Database Schema

### Migration 1: `add_enrollment_timestamps.sql`
```sql
ALTER TABLE "ETUDIANT_COURS"
ADD COLUMN IF NOT EXISTS "enrolledAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS "finishedAt" TIMESTAMP;
```

### Migration 2: `allow_teachers_to_enroll.sql`
```sql
-- Allow both students and teachers to enroll in courses
ALTER TABLE "ETUDIANT_COURS"
DROP CONSTRAINT IF EXISTS "ETUDIANT_COURS_idUser_fkey";

ALTER TABLE "ETUDIANT_COURS"
ADD CONSTRAINT "ETUDIANT_COURS_idUser_fkey"
FOREIGN KEY ("idUser") REFERENCES "USER"("idUser") ON DELETE CASCADE;
```

Note: Run these migrations on your local PostgreSQL database before using the enrollment system. Use the provided migration scripts in `/back/migrations/` directory.

## API Endpoints

### Get Course Details
```
GET /courses/:id
Headers: Authorization: Bearer <token> (optional)
```
- Returns course with `isEnrolled` and `enrollmentData` fields
- Content restricted based on enrollment status

### Enroll in Course
```
POST /courses/:id/enroll
Headers: Authorization: Bearer <token>
```
- Creates enrollment record with timestamps
- Both students and teachers can enroll

### Mark Course as Complete
```
POST /courses/:id/finish
Headers: Authorization: Bearer <token>
```
- Sets completion status and finish timestamp
- Only enrolled users (students and teachers) can finish courses

### Update Course Progress
```
PATCH /courses/:id/progress
Headers: Authorization: Bearer <token>
Body: { "progress": 50 }
```
- Updates progress (0-100%)
- Only enrolled users (students and teachers) can update progress

## Frontend Components

### CourseDetail Page
- Displays enrollment status and progress
- Shows enroll button for unauthenticated/non-enrolled users
- Restricts content based on enrollment
- Allows marking course as complete

### Key UI Elements
1. **Enrollment Status Badge**: Shows enrollment date and completion status
2. **Progress Bar**: Visual indicator of course progress
3. **Course Outline**: Section titles with lock icons for non-enrolled users
4. **Enroll Button**: Prominent CTA for non-enrolled users
5. **Complete Button**: Available for enrolled students

## Usage Flow

1. **Discovery**: User browses courses and views basic information
2. **Enrollment**: User clicks "Enroll Now" (must be logged in)
3. **Learning**: User accesses full course content
4. **Progress**: System tracks progress as user completes sections
5. **Completion**: User marks course as complete

## Implementation Files

### Backend
- `/back/migrations/add_enrollment_timestamps.sql` - Database migration
- `/back/model/coursModel.js` - Course model with enrollment methods
- `/back/controllers/coursController.js` - Enrollment controller logic
- `/back/routes/api/courses.js` - Enrollment API routes
- `/back/middleware/optionalJWT.js` - Optional authentication middleware

### Frontend
- `/front/src/pages/CourseDetail.tsx` - Course detail page with enrollment UI
- `/front/src/services/api.ts` - API service methods for enrollment

## Notes

- The system uses the existing `ETUDIANT_COURS` table for enrollment tracking
- Progress tracking integrates with existing database fields
- JWT authentication is required for enrollment actions
- Content restriction happens at the backend level for security
