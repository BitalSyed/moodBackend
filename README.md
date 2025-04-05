# Project Setup

## 🚀 Main Routes

- `/api/user` - Handles user-related actions.
- `/api/auth` - Handles authentication-related actions.

---

## 🔧 Configuration

1. The `.env` file contains necessary credentials for mail and MongoDB URI.

---

## 🗃️ MongoDB Schema

- The main MongoDB schema is located in `models/user.js`.

---

## 🛠️ Routes

### **Auth Routes** (`routes/auth.js`):

- **`/verify`** - OTP verification.
- **`/authenticate`** - Accepts JWT and returns all user data.

### **User Routes** (`routes/user.js`):

- **`/register`** - Adds data to the database and sends an OTP to the user’s email.
- **`/login`** - Returns JWT upon successful login.
- **`/update`** - Accepts JWT and mood data, updates the data in the database.
- **`/goal`** - Accepts JWT and goal, updates the user's goals in the database.
- **`/tag`** - Accepts JWT and tag, updates the user's tags in the database.

---

## 🛠️ Running the Project

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
npm install
node index.js
```

---

## ⚠️ Note
- Never commit your `.env` files to Git.
- Make sure the frontend `.env` is correctly pointing to your backend URL for API calls to work.
