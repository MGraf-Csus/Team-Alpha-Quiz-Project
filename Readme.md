# Team Alpha — Quiz Project

Lightweight, client-side quiz application built with plain HTML, CSS and JavaScript. Suitable for classroom quizzes, small assessments, and prototype quiz apps. This repository contains the web UI, quiz management pages, and optional Firebase integration helper code.

**Project type:** Static web app (HTML/CSS/JS)

**Status:** Prototype / classroom-ready

**Primary files:**
- `index.html` — Landing / entry page
- `CreateQuiz.html` — UI to create a quiz
- `EditQuiz.html` — Edit existing quizzes
- `ManageQuiz.html` — Quiz management interface
- `QuizApplet.html`, `QuizTemplate.html` — Quiz display templates
- `AdminControlPanel.html`, `AdminSign-in.html` — Admin pages
- `FirebaseHandler.js` — Helper for Firebase integration
- `quizManagement.js`, `quizAppletScript.js`, `quizTemplateScript.js` — Core quiz logic
- `StudentScore.js`, `Quiz.js`, `Item.js` — Domain models and score handling
- `css.css` — Global styles

**Features**
- Create, edit and manage quizzes through the provided HTML UI
- Static client-side quiz runtime for students
- Firebase helper file included to connect to backend services (optional)

Getting started
---------------

Prerequisites
- A modern web browser (Chrome, Edge, Firefox)

Run locally (quick)
- Open locally: open `index.html` using a local server to open in a browser
  (This can be done using most IDE's, due to security changes with web browsers, javascript is no longer loaded when opening an html file.)


Firebase
- `FirebaseHandler.js` contains helper logic to integrate with Firebase. To use Firebase services:
	1. Create a Firebase project and obtain your web config.
	2. Add your Firebase config to `firebaseConfig.js` (or create a secure config flow).
	3. Ensure authentication and database rules are configured as needed.

Project structure (high-level)
- Root HTML pages for each user/admin flow (see filenames above)
- `*.js` — client-side JavaScript modules handling quizzes, UI, and Firebase
- `css.css` — styling for the app
- `images/`, `fonts/` — static assets

