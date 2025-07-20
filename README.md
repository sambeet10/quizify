# Quizify 🎯  
A full-stack quiz and exam system with Google Authentication, role-based access control, real-time scoring, and leaderboard features.

## 🌐 Live Site  
🔗 [https://quizify25.netlify.app](https://quizify25.netlify.app)

---

## 🚀 Features

- 🔐 **Google OAuth Authentication** using Passport.js
- 🧑‍🏫 **Role-based Access** (Quizzer / Quizmaster)
- 🧠 **Create & Manage Quizzes** (Quizmasters)
- ✍️ **Attempt Quizzes** (Quizzers)
- 📊 **Leaderboard** – Global & Quiz-specific rankings
- 📈 **View Attempts & Scores** – Detailed stats for both users and creators
- 📦 JWT-secured backend with protected routes
- 💬 Interactive modals for scores and correct answers
- 📱 Fully responsive design with Bootstrap

---

## 🛠️ Tech Stack

| Layer        | Technology Used                                      |
|--------------|-------------------------------------------------------|
| **Frontend** | React.js, HTML, CSS, Bootstrap                        |
| **Backend**  | Node.js, Express.js                                   |
| **Database** | MongoDB Atlas                                         |
| **Authentication** | Google OAuth 2.0 (Passport.js), JWT           |
| **Deployment** | Frontend - Netlify<br>Backend - Render             |

---

## 📁 Project Structure

```bash
quizify/
├── Backend/              # Node.js + Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── index.js
│
├── quiz-frontend/        # ReactJS frontend
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
