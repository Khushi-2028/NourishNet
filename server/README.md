# Smart Food Redistribution System - Backend

## Overview

This is the backend API for the Smart Food Redistribution System.

The project helps connect food donors, NGOs, and volunteers to reduce food waste through real-time delivery tracking, notifications, analytics, and administration.

Built using:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Firebase Cloud Messaging
- Socket.IO
- Swagger API Documentation

---

# Features

## Authentication

- Register
- Login
- JWT Authentication
- Refresh Tokens
- Password Reset
- Email Verification

---

## Donor

- Donate Food
- View Donations
- Upload Images

---

## NGO

- Pickup Request Management
- Volunteer Assignment
- Dashboard
- Notifications

---

## Volunteer

- Accept Delivery
- Pickup Food
- Start Transit
- Complete Delivery
- Live Location Updates

---

## Delivery Tracking

- Live GPS Location
- ETA Calculation
- Route Optimization
- Tracking History
- Active Deliveries

---

## Notifications

- Database Notifications
- Firebase Push Notifications
- Real-time Socket Notifications

---

## Admin Module

### Dashboard

- Total Users
- Total Donors
- NGOs
- Volunteers
- Donations
- Deliveries
- Active Deliveries

### User Management

- Search
- Pagination
- Filter by Role
- Update User
- Delete User

### NGO Management

- View NGOs
- Approve NGO
- Reject NGO
- Disable NGO

### Volunteer Management

- View Volunteers
- Performance
- Ratings
- Availability

### Donation Management

- Monitor Donation Status

### Delivery Management

- Delivery Timeline
- Volunteer
- NGO
- Donor

### Audit Logs

- View Audit History
- Filter Logs

### Analytics

- Food Saved
- Meals Served
- Active NGOs
- Active Volunteers
- Monthly Deliveries

### Environmental Impact

- Food Waste Prevented
- CO₂ Reduction
- Meals Served

### Reports

- PDF Reports
- Excel Reports
- CSV Reports

---

# Technologies

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Firebase Admin SDK
- Socket.IO
- Swagger
- PDFKit
- ExcelJS
- json2csv

---

# Project Structure

```
src/
│
├── controllers/
├── models/
├── repositories/
├── services/
├── routes/
├── middlewares/
├── sockets/
├── utils/
├── docs/
├── uploads/
├── config/
└── server.js
```

---

# Environment Variables

Create a `.env` file.

Example:

```
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret

JWT_REFRESH_SECRET=your_refresh_secret

EMAIL_USER=your_email

EMAIL_PASS=your_password

GOOGLE_MAPS_API_KEY=your_key
```

Firebase private key should NOT be uploaded to GitHub.

---

# API Documentation

Swagger

```
http://localhost:5000/api-docs
```

---

# Run Project

Install dependencies

```
npm install
```

Run

```
npm run dev
```

---

# Author

Khushi Yadav