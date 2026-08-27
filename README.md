# cohort-9-mern-13815-muhammad

Cohort 9 — MERN (Node.js + React.js) assignment for Muhammad Faizan

# 📝 Notes App — Full-Stack MERN Application

A full-stack note-taking application built as part of the 10Pearls internship program. Users can sign up, log in, and manage rich-text notes with AI-powered summarization, search, sorting, pinning, and a distraction-free "Focus Mode" for writing.

---

## 📚 Table of Contents

1. [Tech Stack](#-tech-stack)
2. [Screenshots](#-screenshots)
3. [Features](#-features)
4. [Testing](#-testing)
5. [Code Quality — SonarQube](#-code-quality--sonarqube)
6. [Project Structure](#-project-structure)
7. [Setup Instructions](#-setup-instructions)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, Tiptap (rich text editor), React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Authentication | JWT (JSON Web Tokens), httpOnly cookies, bcryptjs |
| AI Integration | Google Gemini API (`gemini-3.6-flash`) — note summarization |
| Logging | Pino / pino-http |
| Backend Testing | Mocha, Chai, Supertest, MongoDB test database |
| Frontend Testing | Jest, React Testing Library |
| Code Quality | SonarQube (Local Docker Setup) |
| Code Review | CodeRabbit (automated PR review) |
| Version Control | Git, GitHub (fork-based PR workflow) |

---

## 📸 Screenshots

### Login Page
![Login Page](/screenshots/login.png)

### Register / Signup Page
![Register Page](/screenshots/register.png)

### Empty Dashboard
![Empty Dashboard](/screenshots/edashboard.png)

### Note Modal (Create / Edit)
![Note Modal](/screenshots/notesModal.png)

### Dashboard With Notes
![Dashboard With Notes](/screenshots/dashboard.png)

### Focus Mode (Scratchpad)
![Focus Mode](/screenshots/focus.png)

### SonarQube Analysis
![SonarQube Analysis](/screenshots/sonarQubeAnalysis.png)

---

## ✨ Features

### 1. 🔐 Login
Users can log in with their email and password. Credentials are verified against the hashed password in the database, and a JWT is issued as an httpOnly cookie to maintain the session.

### 2. 🆕 Register (Signup)
New users can create an account with their name, email, and password. Passwords are hashed automatically before being stored, and the user is logged in immediately after successful registration.

### 3. ➕ Create Note
Users can create new notes with a title and rich-text content. Content is sanitized on the backend before being saved, and every note is scoped to the logged-in user.

### 4. ✏️ Update Note
Existing notes can be edited. Ownership is verified on the backend before any update is applied, ensuring users can only modify their own notes.

### 5. 🗑️ Delete Note
Notes can be deleted with a confirmation prompt. The backend ensures a note can only be deleted by the user who owns it.

### 6. ✨ AI Summarize
Users can generate a short AI-powered summary of any note using the Google Gemini API. The summary is generated on demand and cached in the UI so it isn't regenerated unnecessarily.

### 7. 🔍 Search
A debounced search box lets users filter their notes by matching text in the title or content, without sending a request on every keystroke.

### 8. 🔤 Sort (A-Z / Z-A)
Notes can be sorted alphabetically by title (ascending or descending) or by last updated, with pinned notes always appearing first regardless of sort order.

### 9. 🖥️ Focus Mode (Scratchpad)
A distraction-free, full-screen writing mode with no toolbar or UI clutter — just the text. A floating formatting menu appears only when text is selected. Pressing `Esc` automatically saves the note and exits.

### 10. 📌 Pin Note
Important notes can be pinned to keep them at the top of the dashboard. Each pinned note is highlighted with a distinct pastel color for quick visual identification.

---

## 🧪 Testing

### Frontend — Jest + React Testing Library

Frontend components are tested using **Jest** as the test runner/assertion library, combined with **React Testing Library (RTL)** to test components the way a real user would interact with them — finding elements by visible text, role, or placeholder rather than internal implementation details.

**Setup:**
- `jest.config.cjs` — configures `jsdom` as the test environment, points to setup files
- `babel.config.cjs` — transforms JSX/ESM so Jest (which doesn't use Vite's bundler) can understand React code
- `src/jest.polyfills.js` — polyfills `TextEncoder`/`TextDecoder`, which `jsdom` doesn't provide by default but `react-router-dom` requires
- `src/setupTests.js` — imports `@testing-library/jest-dom`, adding matchers like `toBeInTheDocument()`

**What's tested:**
- `Login.jsx` — renders inputs/button correctly, allows typing, shows the signup link
- `NoteCard.jsx` — renders title and rich text content correctly, calls `onEdit`/`onDelete` with the correct note data when buttons are clicked

Run with:
```bash
cd Frontend
npm test
```

### Backend — Mocha, Chai, Supertest

Backend routes are tested using **Mocha** as the test runner, **Chai** for assertions (`expect(...).to.equal(...)`), and **Supertest** to simulate HTTP requests directly against the Express app — without needing to start a real server on a live port.

**Setup:**
- `tests/setup.js` — connects to a **separate test database** (`MONGO_URI_TEST`) before tests run, and drops/closes it afterward, so tests never touch real development data
- `tests/auth.test.js` — covers signup, login, logout, including duplicate-email rejection and invalid-credential rejection
- `tests/notes.test.js` — covers full CRUD for notes, including **IDOR protection tests** (verifying one user cannot read, update, or delete another user's notes)

Run with:
```bash
cd Backend
npm test
```

---

## 📊 Code Quality — SonarQube

This project uses **SonarQube** for static code analysis and code quality inspection.

SonarQube is configured and run **locally using Docker**, with **WSL 2** as the backend environment. The project is analyzed locally to identify code smells, bugs, vulnerabilities, security hotspots, and other code quality issues.

### 🛠️ SonarQube Setup

- **SonarQube:** Running locally in a Docker container
- **Container Image:** `sonarqube:community`
- **Container Port:** `9000`
- **Backend:** WSL 2
- **Analysis:** Performed locally on the development machine
- **Configuration:** `sonar-project.properties`

The SonarQube dashboard can be accessed locally through:

```
http://localhost:9000
```

The `sonar-project.properties` file contains the configuration required for analyzing the project, including source directories, test directories, and excluded files/folders.

---

## 📁 Project Structure

```text
cohort-9-mern-13815-muhammad/
│
├── Backend/
│   ├── src/
│   │   ├── config/          # logger.js, gemini.js
│   │   ├── models/          # User.js, Note.js
│   │   ├── controllers/     # authController.js, notesController.js
│   │   ├── routes/          # authRoutes.js, notesRoutes.js
│   │   ├── middlewares/     # authMiddleware.js, errorHandler.js, validateRequest.js
│   │   ├── utils/           # AppError.js, generateToken.js
│   │   └── app.js
│   ├── tests/               # auth.test.js, notes.test.js, setup.js
│   └── server.js
│
├── Frontend/
│   ├── src/
│   │   ├── api/             # axios.js, notesApi.js
│   │   ├── context/         # AuthContext.jsx
│   │   ├── components/      # NoteCard.jsx, NoteModal.jsx, RichTextEditor.jsx, ProtectedRoute.jsx
│   │   ├── pages/            # Login.jsx, Signup.jsx, Dashboard.jsx
│   │   └── App.jsx
│   ├── jest.config.cjs
│   └── babel.config.cjs
│
├── sonar-project.properties
└── README.md
```

---

## ⚙️ Setup Instructions

### Backend
```bash
cd Backend
npm install
# create a .env file with:
# MONGO_URI=your_mongodb_connection_string
# MONGO_URI_TEST=your_test_database_connection_string
# JWT_SECRET=your_jwt_secret
# GEMINI_API_KEY=your_gemini_api_key
# PORT=5000
npm run dev
```

### Frontend
```bash
cd Frontend
npm install
# create a .env file with:
# VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
```

---

## 👤 Author

**Muhammad Faizan** — MERN Stack Developer, 10Pearls Internship (Cohort 9)

Special thanks to my mentor **Tahir Akhter** for his guidance throughout this project.