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
        quizRef.href = `QuizTemplate.html?id=${encodeURIComponent(quizId)}`;

        header.appendChild(quizRef);
        wrapper.appendChild(header);
        fragment.appendChild(wrapper);
    });

    quizListContainer.appendChild(fragment);
}

window.addEventListener("DOMContentLoaded", init);
