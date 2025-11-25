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
- `FirebaseHandler.js` — Helper for Firebase integration (if used)
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
- (Optional) `python` or `npx` for running a local static server

Run locally (quick)
- Option A — Open locally: double-click `index.html` to open in a browser. Note: some browser features (like fetch or certain file-based storage) may be restricted when opening files via `file://`.
- Option B — Serve via a local static server (recommended):

PowerShell examples
```powershell
# With Python 3
python -m http.server 8000

# Or with http-server (Node.js)
npx http-server -p 8000
```

Then open `http://localhost:8000` in your browser and navigate to `index.html`.

Firebase (optional)
- `FirebaseHandler.js` contains helper logic to integrate with Firebase. To use Firebase services:
	1. Create a Firebase project and obtain your web config.
	2. Add your Firebase config to `FirebaseHandler.js` (or create a secure config flow).
	3. Ensure authentication and database rules are configured as needed.

Project structure (high-level)
- Root HTML pages for each user/admin flow (see filenames above)
- `*.js` — client-side JavaScript modules handling quizzes, UI, and Firebase
- `css.css` — styling for the app
- `images/`, `fonts/` — static assets

Notes & recommendations
- This project is purely client-side by default. If you need persistence across users or long-term storage, deploy a backend (Firebase, simple Node API, etc.) and connect via `FirebaseHandler.js` or by adding a new backend layer.
- Consider securing admin pages behind authentication before using in production.

Contributing
------------
- Update or fix pages/scripts and open a PR with a short description of changes.
- Add tests or demo data to help reviewers verify functionality.

License
-------
No license is specified in this repository. If you want to make this project open-source, add a `LICENSE` file (for example, the MIT License).

Contact
-------
If you need help getting this running or want to add features (grading, timers, analytics, etc.), open an issue or contact the project owner.

--
Generated README for `Team-Alpha-Quiz-Project`.

