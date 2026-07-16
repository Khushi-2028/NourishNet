# NourishNet – A Web-Based Food Donation and Distribution Management System with Real-Time Tracking

## Overview

**NourishNet** is a full-stack web application developed to bridge the gap between food donors, NGOs, volunteers, and administrators by providing a centralized platform for efficient food redistribution. The system minimizes food waste while ensuring surplus food reaches people in need through a structured and transparent delivery process.

The platform incorporates secure authentication, role-based access control, real-time delivery tracking, volunteer management, live notifications, route optimization, and analytical dashboards to streamline the complete food donation lifecycle.

---

## Problem Statement

Every day, a significant amount of edible food is wasted while many individuals struggle to access sufficient meals. Existing donation processes are often unorganized, lack transparency, and provide no real-time coordination between donors, NGOs, and volunteers.

NourishNet addresses these challenges by offering a digital platform that efficiently manages donations, pickups, deliveries, and live tracking.

---

## Objectives

* Reduce food wastage through efficient redistribution.
* Connect donors with nearby NGOs.
* Enable volunteers to manage deliveries efficiently.
* Provide real-time delivery tracking.
* Improve transparency using notifications and delivery status updates.
* Offer administrators complete control over users, donations, and deliveries.

---

## Key Features

### Authentication

* User Registration
* Secure Login
* JWT Authentication
* Refresh Token Mechanism
* Email Verification
* Password Reset

### Donor Module

* Create Food Donations
* Upload Food Images
* Manage Donations
* Track Donation Status
* Personal Dashboard

### NGO Module

* Browse Available Donations
* Accept Donations
* Create Pickup Requests
* Assign Volunteers
* Confirm Deliveries
* Track Deliveries in Real-Time

### Volunteer Module

* Accept Assigned Deliveries
* Pickup Food
* Start Transit
* Upload Delivery Proof
* Complete Deliveries
* Live Location Updates

### Admin Module

* User Management
* NGO Management
* Volunteer Management
* Donation Monitoring
* Delivery Monitoring
* Analytics Dashboard
* Environmental Impact Reports
* Audit Logs
* PDF, Excel, and CSV Report Generation

### Real-Time Features

* Live Delivery Tracking
* ETA Calculation
* Socket.IO Notifications
* Push Notifications
* Route Optimization
* Delivery Timeline

---

## Technology Stack

### Frontend

* React 19
* Vite
* Tailwind CSS
* Redux Toolkit
* React Router DOM
* Axios
* React Hook Form
* Socket.IO Client
* React Leaflet
* OpenStreetMap
* Recharts
* Framer Motion

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Socket.IO
* Firebase Cloud Messaging
* Swagger
* PDFKit
* ExcelJS
* JSON2CSV

---

## System Architecture

```
Donor
   │
   ▼
Frontend (React + Redux)
   │
REST APIs + Socket.IO
   │
Backend (Node.js + Express)
   │
MongoDB Database
   │
────────────────────────────────
│
├── Authentication
├── Donation Management
├── NGO Management
├── Volunteer Management
├── Delivery Tracking
├── Notifications
├── Analytics
└── Report Generation
```

---

## User Roles

### Donor

* Register and Login
* Create Donations
* Upload Food Images
* Monitor Donation Status

### NGO

* View Available Donations
* Accept Donations
* Create Pickup Requests
* Assign Volunteers
* Confirm Deliveries

### Volunteer

* View Assigned Deliveries
* Update Delivery Status
* Upload Proof of Delivery
* Share Live Location

### Administrator

* Manage Users
* Manage NGOs
* Manage Volunteers
* View Analytics
* Generate Reports
* Monitor Deliveries
* Maintain Audit Logs

---

## Project Structure

```
NourishNet
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── utils/
│   │   └── validators/
│   │
│   ├── uploads/
│   └── package.json
│
├── POSTMAN/
│
└── README.md
```

---
## Project Demonstration

Watch the complete project demo here:

 https://drive.google.com/file/d/1iYtF1KBDP8UMsg-q4tZp0SNH_vQiC1_k/view?usp=drivesdk
---
## Installation

### Clone Repository

```bash
git clone https://github.com/Khushi-2028/NourishNet.git
```

### Move into Project

```bash
cd NourishNet
```

---

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file and configure:

```
PORT=5000

MONGO_URI=YOUR_MONGODB_URI

JWT_ACCESS_SECRET=YOUR_ACCESS_SECRET

JWT_REFRESH_SECRET=YOUR_REFRESH_SECRET

EMAIL_USER=YOUR_EMAIL

EMAIL_PASS=YOUR_EMAIL_PASSWORD
```

Run backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env`

```
VITE_API_BASE_URL=http://localhost:5000/api

VITE_SERVER_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

---

## API Documentation

Swagger Documentation

```
http://localhost:5000/api-docs
```

The project also includes a complete Postman Collection inside the **POSTMAN** folder.

---

## Major Modules

* Authentication
* Donation Management
* Pickup Management
* Delivery Management
* Volunteer Management
* NGO Management
* Real-Time Tracking
* Notifications
* Dashboard Analytics
* Environmental Impact Analysis
* Report Generation

---

## Future Enhancements

* AI-Based Food Demand Prediction
* QR Code-Based Delivery Verification
* Payment Gateway for Donations
* Mobile Application
* Multi-Language Support
* Blockchain-Based Donation Verification
* IoT Integration for Food Quality Monitoring

---

## Learning Outcomes

This project provided practical experience in:

* MERN Stack Development
* REST API Design
* JWT Authentication
* Role-Based Access Control
* MongoDB Database Design
* Socket.IO Real-Time Communication
* File Upload Management
* Swagger Documentation
* State Management with Redux Toolkit
* Professional Git & GitHub Workflow

---

## Author

**Khushi Yadav**

Bachelor of Technology (Computer Science and Engineering)

Shri Shankaracharya Institute of Professional Management and Technology (SSIPMT), Raipur

---

## License

This project was developed as an academic major project for educational and portfolio purposes.
