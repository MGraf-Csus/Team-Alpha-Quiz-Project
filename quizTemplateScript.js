import { service } from "./BackendExtensionService.js";
import { StudentScore } from "./StudentScore.js";

// -------------------- State --------------------
let quiz = null;
let quizId = null;
let testerId = null;
let testerDoc = null;
let questionsAnswered = 0;
let userAnswers = [];
let correctAnswers = [];
let correctness = [];

// -------------------- Init --------------------
export async function initQuiz() {
    await loadQuiz();
    await setTesterId();
    await checkSavedQuiz();
    preprocessQuiz();
    initCounters();
    startTimer();
    renderQuiz();
    setupPageLeaveHandlers();
}


// -------------------- Loading --------------------
async function loadQuiz() {
    const params = new URLSearchParams(window.location.search);
    quizId = params.get("id");

    if (!quizId) {
        console.error("Error: No quiz ID found in URL.");
        return;
    }

    try {
        quiz = await service.getQuizTakingView(quizId);
    } catch (err) {
        console.error("Error loading quiz:", err);
        quizId = params.get("id");
    }
}

// Also checks if tester already took test
async function setTesterId() {
    const params = new URLSearchParams(window.location.search);
    testerId = params.get("username");
    if (quiz.studentScores.some((s) => s.studentId === testerId)) {
        alert("You have already taken this quiz.\n" + "You Scored: " + `${quiz.studentScores.find(s => s.studentId === testerId).score}`);
        window.location.href = "QuizApplet.html";
    }
    testerDoc = await service.getAccount(testerId);
}

// -------------------- Page leave / back button --------------------
function setupPageLeaveHandlers() {
    // Used to check if back or forward has happened
    history.pushState({ page: 1 }, "", window.location.href);

    // Detect back / forward navigation
    window.addEventListener("popstate", () => {
        console.log("Back/forward detected — saving answers");
        saveQuizLocally();
    });

    // Detect page refresh, close, or leaving page
    window.addEventListener("beforeunload", (event) => {
        console.log("Page leaving saving answers");
        saveQuizLocally();

        // Browser warning
        event.preventDefault();
        event.returnValue = "";
    });

    // detect F5 key specifically for refreshes
    window.addEventListener("keydown", (event) => {
        if ((event.key === "F5") || (event.ctrlKey && event.key === "r")) {
            console.log("Refresh detected via keyboard — saving answers");
            saveQuizLocally();
        }
    });
}
function saveQuizLocally() {
    const save = {
        userAnswers,
        correctness,
        questionsAnswered,
        timestamp: Date.now()
    };
    localStorage.setItem("quizSave_" + testerId, JSON.stringify(save));
}
async function checkSavedQuiz() {
    const saved = localStorage.getItem("quizSave_" + testerId);
    if (saved) {
        console.log("Detected previous unsent quiz — auto-submitting");
        await submitExam(true, "Auto-submitted due to refresh/back/close");
        localStorage.removeItem("quizSave_" + testerId);
        return true;
    }
    return false;
}

function preprocessQuiz() {
    correctAnswers = quiz.items.map(q =>
        q.choices[q.correctAnswer - 1].trim()
    );
}

function initCounters() {
    const counterEl = document.getElementById("questions-answered");
    counterEl.textContent = `0 / ${quiz.numQuestions}`;
}

// -------------------- Rendering --------------------
function renderQuiz() {
    const pageTitles = document.querySelector(".page-titles");
    const questionsBody = document.querySelector(".questions-body");
    const mainBody = document.querySelector(".main-body");

    pageTitles.textContent = quiz.id;
    questionsBody.innerHTML = "";

    const fragment = document.createDocumentFragment();

    quiz.items.forEach((q, i) => {
        const qNumber = i + 1;

        const container = document.createElement("div");
        container.className = "question-container";

        const numberEl = createEl("h3", "question-number", `Question ${qNumber}`);
        const textEl = createEl("h3", "question-text", q.question);

        const choicesWrapper = document.createElement("div");
        choicesWrapper.className = "choices-wrapper";

        q.choices.forEach((choice, index) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = choice;
            btn.className = `q${qNumber}`;
            btn.id = `q${qNumber}-${index + 1}`;
            btn.onclick = () => answer(qNumber, index + 1, choice);
            choicesWrapper.appendChild(btn);
        });

        const selectedLabel = createEl("h3", "", "You Selected:");
        selectedLabel.id = `answerq${qNumber}`;

        container.append(numberEl, textEl, choicesWrapper, selectedLabel);
        fragment.appendChild(container);
    });

    questionsBody.appendChild(fragment);

    // Submit button
    const submitBtn = createEl("button", "quiz-submit-btn", "Submit Exam");
    submitBtn.type = "button";
    submitBtn.addEventListener("click", () => submitExam(false));
    mainBody.appendChild(submitBtn);
}

function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
}

// -------------------- Answering --------------------
function answer(qNumber, choiceIndex, choiceText) {
    // Grade choice
    userAnswers[qNumber - 1] = choiceText.trim();
    correctness[qNumber - 1] = userAnswers[qNumber - 1] === correctAnswers[qNumber - 1];

    // Update label
    const label = document.getElementById(`answerq${qNumber}`);
    if (!label.dataset.answered) {
        questionsAnswered++;
        label.dataset.answered = "true";
        updateAnsweredCounter();
    }
    label.textContent = `You Selected: ${quiz.items[qNumber - 1].choices[choiceIndex - 1]}`;

    // Highlight the selected button
    highlightSelectedButton(qNumber, choiceIndex);
}

function updateAnsweredCounter() {
    const counterEl = document.getElementById("questions-answered");
    counterEl.textContent = `${questionsAnswered} / ${quiz.numQuestions}`;
}

function highlightSelectedButton(qNumber, selectedIndex) {
    const numChoices = quiz.items[qNumber - 1].choices.length;

    for (let i = 1; i <= numChoices; i++) {
        const btn = document.getElementById(`q${qNumber}-${i}`);
        btn.classList.toggle("selected-choice", i == selectedIndex);
    }
}

// -------------------- Timer --------------------
let timerInterval = null;
let timerStopped = false;
function startTimer() {
    const timerEl = document.getElementById("timer");
    let timeLeft = quiz.timerLength;
    timerStopped = false;

    timerInterval = setInterval(() => {
        if (timerStopped) {
            return;
        }

        timerEl.textContent = formatTime(timeLeft);
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            timerEl.textContent = "00:00:00";
            submitExam(true, "Times Up Submitting Exam");
        }
    }, 1000);
}
function stopTimer() {
    timerStopped = true;
}
function resumeTimer() {
    timerStopped = false;
}

function formatTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
}

// -------------------- Submit --------------------
async function submitExam(forceSub = false, forceMessage = "") {
    // Stop timer if running
    stopTimer();

    const confirmNeeded = questionsAnswered != quiz.numQuestions;
    const ok = await showConfirmModal(
        confirmNeeded
            ? "You still have unanswered questions.\nSubmit anyway?"
            : "Confirm submit?",
            forceSub,
            forceMessage
    );

    if (!ok) {
        resumeTimer();
        return;
    }

    const score = correctness.filter(x => x === true).length;

    // Store student score in quiz and user
    quiz.studentScores.push(new StudentScore(testerId, `${score}/${quiz.items.length}`));
    await service.editQuiz(quizId, quiz);

    if (!testerDoc.studentScores) testerDoc.studentScores = [];
    testerDoc.studentScores.push({ quizId, score: `${score}/${quiz.items.length}` });
    service.editAccount(testerId, testerDoc);

    let scoreEl = document.getElementById("quiz-submitted-score");
    if (!scoreEl) {
        scoreEl = createEl("div", "", "");
        scoreEl.id = "score-container";
        document.querySelector(".main-body").appendChild(scoreEl);
    }

    scoreEl.textContent = `${score} / ${quiz.items.length}`;

    const leave = confirm("Quiz Was Submitted Succesfully!\n" + "You Scored: " + `${score}/${quiz.items.length}`);
    if (leave) {
        window.location.href = "QuizApplet.html";
    }
}

// -------------------- Confirm --------------------
function showConfirmModal(message, forceOk = false, forceMessage = "") {
    return new Promise(resolve => {
        const modal = document.getElementById("confirmModal");
        const text = document.getElementById("confirmText");
        const yes = document.getElementById("confirmYes");
        const no = document.getElementById("confirmNo");

        text.textContent = message;
        modal.classList.remove("hidden");

        if (forceOk) {
            text.textContent = forceMessage;
            no.style.display = "none"; // hide the button
            resolve(true);
            
        } else {
            no.style.display = "inline-block"; // show the button
        }

        yes.onclick = () => {
            modal.classList.add("hidden");
            resolve(true);
        };

        no.onclick = () => {
            modal.classList.add("hidden");
            resolve(false);
        };
    });
}

window.initQuiz = initQuiz;
