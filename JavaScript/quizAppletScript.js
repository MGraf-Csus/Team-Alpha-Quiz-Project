import { service } from "./BackendExtensionService.js";

let quizIds = [];

async function init() {
    quizIds = await service.getAllQuizIDS();
    renderQuizList();
}
function renderQuizList() {
    const mainBody = document.querySelector(".main-body");
    const quizListContainer = document.createElement("div");
    quizListContainer.className = "quiz-list-container";
    mainBody.appendChild(quizListContainer);

    const fragment = document.createDocumentFragment();

    quizIds.forEach(quizId => {
        const wrapper = document.createElement("div");
        wrapper.className = "quiz-name-wrapper";

        const header = document.createElement("h4");
        header.className = "quiz-name";
        
        const quizRef = document.createElement("a");
        quizRef.textContent = quizId;

        // Intercept click to require login
        quizRef.addEventListener("click", (e) => {
            renderSignInPopUp(quizId);
        });

        header.appendChild(quizRef);
        wrapper.appendChild(header);
        fragment.appendChild(wrapper);
    });

    quizListContainer.appendChild(fragment);
}

function renderSignInPopUp(quizId) {
    const modal = document.getElementById("quiz-login");
    modal.style.display = "flex";

    // Submit Button
    const submitBtn = document.getElementById("loginSubmit-quiz-login");
    submitBtn.onclick = async () => {
        const usernameInput = document.getElementById("username-quiz-login");
        const passwordInput = document.getElementById("password-quiz-login");
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        let user = await service.getAccount(username);
        if(user.role !== "admin") {
            if (!username || !password) {
                if (!username) usernameInput.classList.add("input-error");
                else usernameInput.classList.remove("input-error");
                if (!password) passwordInput.classList.add("input-error");
                else passwordInput.classList.remove("input-error");
                return;
            } else {
                usernameInput.classList.remove("input-error");
                passwordInput.classList.remove("input-error");
            }

            if (await service.signIn(username, password)) {
                modal.style.display = "none";
                window.location.href = window.location.href = `QuizTemplate.html?id=${encodeURIComponent(quizId)}&username=${encodeURIComponent(username)}`;
            }
        }
        else {
            alert("Cannot take quiz as an admin");
        }
    };

    // Cancel Button
    const cancelBtn = document.getElementById("loginSubmit-quiz-cancel");
    cancelBtn.onclick = async () => {
        modal.style.display = "none";
    };
}

window.addEventListener("DOMContentLoaded", init);
