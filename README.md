# JournalMe
JournalMe is a journaling application that allows users to create daily entries, upload photos, and track streaks. Keep track of daily habits, gym sessions, hangouts with friends, special events, or just about anything! With many useful features, the goal of JournalMe is to make capturing everyday life simple, rewarding and engaging.

Team (Group 49):
* Andrew Prasetya
* Sriranjani Subramania Sharma
* Samuel Li
* Songyou Yang 

Project for CS 35L (Dürschmid) at UCLA. 

---

# 🚀 Features
* Create journal entries with text, images, and tags
* JWT-based authentication (Google OAuth)
* Daily streak tracking
* Search entries by title, content, or tags
* Delete and manage journal entries
* Built with React (Vite) frontend + Django backend

---

# 📦 Running the App Locally

## 1. Clone the Repository

`git clone https://github.com/CaboozledPie/journal-me.git` \
`cd journal-me`

## 2. Backend Setup (Django)

Install backend dependencies: \
`pip install -r requirements.txt`

Run database migrations: \
`python manage.py migrate`

Start the backend server: \
`python manage.py runserver`

To run normally, navigate to the front-end directory and run: \
`npm run build` \
`npm run preview`

## 3. Frontend Setup (React + Vite)

Navigate to the frontend directory: \
`cd front-end`

Install frontend dependencies: \
`npm install`

## 4. Running the App (Production Preview Mode)

`npm run build` \
`npm run preview`

Open your browser at: \
`http://localhost:5001`

---

# 🧪 Running the App for Testing

Start the frontend dev server: \
`npm run dev`

Run automated tests (in a separate terminal): \
`cd webtests` \
`pytest`


