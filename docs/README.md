# API Documentation

This folder contains the Swagger API documentation for the Prep30 Backend application.

## Files

- `swagger.js` - Main Swagger configuration file
- `api-docs.js` - Detailed API endpoint documentation with examples
- `README.md` - This file

## Accessing the Documentation

Once the server is running, you can access the interactive API documentation at:

```
http://localhost:5000/api-docs
```

## API Endpoints Documented

### Authentication (`/api/auth`)
- `POST /api/auth/otp/send` - Send OTP to mobile number
- `POST /api/auth/otp/verify` - Verify OTP and authenticate user
- `POST /api/auth/google` - Authenticate with Google

### Admin (`/api/admin`) - Requires Admin Role
- `POST /api/admin/course` - Create a new course
- `POST /api/admin/subject` - Create a new subject
- `POST /api/admin/chapter` - Create a new chapter
- `POST /api/admin/quiz` - Create a new quiz

### Quiz (`/api/quizzes`) - Requires Authentication
- `GET /api/quizzes/` - Get all available quizzes
- `POST /api/quizzes/submit` - Submit quiz answers

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Admin endpoints require both authentication and admin role.

## Testing

You can test all endpoints directly from the Swagger UI interface at `/api-docs`. The interface provides:

- Interactive API testing
- Request/response examples
- Parameter validation
- Authentication support

## Schema Definitions

The documentation includes comprehensive schema definitions for:

- User model
- Course, Subject, Chapter models
- Quiz model
- Request/Response schemas
- Error handling schemas
