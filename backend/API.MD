# API Documentation

## 1. User Management

### Register a new user (sign up)
- **POST /signup**
    - Example request body:
      ```json
      {
        "tokenId": "YOUR_TOKEN_ID_HERE",
        "username": "john_doe",
        "firstName": "John",
        "lastName": "Doe"
      }
      ```

### Authenticate and log in a user
- **POST /login**
    - Example request body:
      ```json
      {
        "tokenId": "YOUR_TOKEN_ID_HERE"
      }
      ```

### Fetch the currently authenticated user's details
- **GET /api/users/me**

### Update the currently authenticated user's details
- **PUT /api/users/me**

### Delete a specific user by user ID
- **DELETE /api/users**
    - Example request parameters:
      `?userId=USER_ID_HERE`

## 2. School Management (for Admins)

### Create a new school
- **POST /schools**
    - Example request body:
      ```json
      {
        "name": "CSUSM",
        "currentSemester": "Fall 2023",
        "semesterStart": "2023-09-01",
        "semesterEnd": "2023-12-15"
      }
      ```

### Fetch all schools
- **GET /api/schools**

### Fetch details of a specific school
- **GET /api/schools/:schoolId**

### Update details of a specific school
- **PUT /api/schools/:schoolId**

### Delete a specific school
- **DELETE /api/schools/:schoolId**

## 3. Class Management

### Create a new class (admins only)
- **POST /api/classes**
    - Example request body:
      ```json
      {
        "name": "Introduction to Computer Science",
        "semester": "Fall 2023",
        "canvasId": "CS101",
        "schoolId": "1"
      }
      ```

### Fetch all classes
- **GET /api/classes**

### Fetch details of a specific class
- **GET /api/classes/:classId**

### Update details of a specific class
- **PUT /api/classes/:classId**

### Delete a specific class (admins only)
- **DELETE /api/classes/:classId**

## 4. Event Management

### Create a new event for the authenticated user
- **POST /apit/events**
    - Example request body:
      ```json
      {
        "eventType": "Test",
        "eventTitle": "Test for CS 101",
        "eventDescription": "need to study",
        "startTime": "2023-11-10T09:00:00",
        "endTime": "2023-11-12T18:00:00"
      }
      ```

### Fetch all events of the authenticated user
- **GET /api/events**

### Fetch details of a specific event of the authenticated user
- **GET /api/events/:eventId**

### Update a specific event of the authenticated user
- **PUT /api/events/:eventId**

### Delete a specific event of the authenticated user
- **DELETE /api/events/:eventId**

## 5. Canvas Integration (for Users)

### Set a Canvas token for the authenticated user
- **POST /api/users/me/canvas**
    - Example request body:
      ```json
      {
        "canvasToken": "YOUR_CANVAS_TOKEN_HERE",
        "schoolId": "SCHOOL_ID_HERE"
      }
      ```

### Fetch the Canvas token associated with the currently authenticated user
- **GET /api/users/me/canvas**

### Fetch all classes for a given school ID for the authenticated user with a Canvas token
- **GET /api/canvas/:schoolId**

## User-Class Association

### Associate the authenticated user with a class
- **POST /api/users/me/classes/:classId**

### Fetch all classes associated with the authenticated user
- **GET /api/users/me/classes**

### Remove association of the authenticated user from a specific class
- **DELETE /api/users/me/classes/:classId**

## User-School Association

### Associate the authenticated user with a school
- **POST /api/users/me/schools/:schoolId**

### Fetch all schools associated with the authenticated user
- **GET /api/users/me/schools**

### Remove association of the authenticated user from a specific school
- **DELETE /api/users/me/schools/:schoolId**
