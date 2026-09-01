# 🏨 LuxuryStay - Hotel Management System (MERN)

A comprehensive Full-stack Hotel Management System built with the MERN Stack, featuring online and walk-in bookings, real-time room availability, role-based authentication & authorization, and dedicated dashboards.

---

## 🚀 How to Run this Project

Follow these steps to get the project running on your local machine:

1. **Install Dependencies:** Run `npm i` in both `Frontend` and `Backend` folders.
2. **Navigate & Start:** Open two separate terminals and run the following:

* **For Frontend:**
  ```bash
  cd Frontend
  npm run dev
  ```
* **For Backend:**
  ```bash
  cd Backend
  npm run dev
  ```

---

## 🔗 Important Auth Routes

* **Guest Login:** [http://localhost:5173/login](http://localhost:5173/login)
* **Staff Login:** [http://localhost:5173/ManagementLogin](http://localhost:5173/ManagementLogin) *(Admin, Manager, Receptionist, Housekeeping)*

### 🔑 Authentication Credentials
* **Admin Password:** `admin123`
* **All Staff Users' Password:** `123456`
* **All Guests' Password:** `123456`

---

## 👥 User Roles & Permissions

We manage two types of guests in this project: **Walk-in Guests** (handled by receptionist) and **Online Guests** (self-booking).

### 1. 👤 Guests
* **Suggested Login:** `sarakhan@gmail.com`
* **Permissions:**
  * Register/login at the guest route.
  * Must be logged in to use Contact and Feedback features.
  * Book available rooms after logging in.
  * View or cancel bookings in the profile booking section.
  * View and pay invoices (receives an email after successful payment confirmation).
  * Update profile and change password.

### 2. 👑 Admin
* **Suggested Login:** `admin123`
* **Permissions:**
  * Access dashboard and view reports.
  * Full CRUD (Create, Read, Update, Delete) on **Rooms**, **Staff Members**, and **Services**.
  * View bookings (read-only), customer feedback, and contacts.
  * Resolve maintenance issues.
  * Change or remove system settings.

### 3. 💼 Manager
* **Suggested Login:** `zubairkamal@gmail.com`
* **Permissions:**
  * Access dashboard and view reports.
  * View staff and services (read-only).
  * Report maintenance issues, view customer feedback, and contacts.
  * *Note: Cannot register staff; only Admin can add staff.*

### 4. 🛎️ Receptionist
* **Suggested Login:** `rubabkhan@gmail.com`
* **Permissions:**
  * Access dashboard, view reports, rooms, and services.
  * Report maintenance issues, view and pay invoices.
  * Create walk-in guests and book rooms in a single process *(Sends a password setup email to the guest)*.
  * Manage booking status (`pending`, `confirmed`, `checked-in`, `checked-out`, `cancelled`).

> 💡 **Important Concept:** Walk-in guests' booking status is initially **confirmed**. Online/self-booked guests' status starts as **pending** until confirmed by the receptionist.

### 5. 🧹 Housekeeper
* **Suggested Login:** `neelamnaaz@gmail.com`
* **Permissions:**
  * View cleaning tasks and rooms.
  * Update room status from **Cleaning** to **Available** using the "Mark Available" button.
  * Report maintenance issues.

---

## 🔄 Room Status Logic

* **Booking (Pending/Confirmed)** ➡️ Room Status: `Available`
* **Booking (Checked-in)** ➡️ Room Status: `Occupied`
* **Booking (Checked-out)** ➡️ Room Status: `Cleaning`
* **After Cleaning** ➡️ Room becomes `Available` again
* *Note: After checkout, the receptionist can generate the bill.*

---
Thank you from the **LuxuryStay Developer**!
