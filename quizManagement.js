import {service} from "./BackendExtensionService.js";
import {Item} from "./Item.js";
import {Quiz} from "./Quiz.js";

export function addTableRow() {
    // getting and defining variable for table from html
    let table = document.getElementById("quizQuestionList");
    let row = table.insertRow(-1);

    // define cells of table row
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);

    // filling cells with html for each of the input fields
    cell1.innerHTML = "<input type='text' size='15' id='Question' name='Question' placeholder='Enter question'>";
    cell2.innerHTML = "<input type='text' size='15' id='answerA' name='answerA' placeholder='Enter answer A'>";
    cell3.innerHTML = "<input type='text' size='15' id='answerB' name='answerB' placeholder='Enter answer B'>";
    cell4.innerHTML = "<input type='text' size='15' id='answerC' name='answerC' placeholder='Enter answer C'>";
    cell5.innerHTML = "<input type='text' size='15' id='answerD' name='answerD' placeholder='Enter answer D'>";
    cell6.innerHTML = "<input type='text' size='11' id='correctAnswer' name='correctAnswer' placeholder='answer (a,b,c,d)'>";

}


export async function createNewQuiz() {
    //popup to confirm
    let confirmation = confirm("Are you wanting to save the quiz with these changes?");
    if (confirmation) {

        // TEMP VALUE
        let ownerId = "1";

        // defining each part of a Quiz object
        let id = document.getElementById("quizNameInput").value;
        let items = defineItems();
        let timerLength = document.getElementById("timerLengthInput").value;
        let numQuestions = document.getElementById("quizQuestionAmountInput").value;
        let studentScores = [];

        // newQuiz object defined
        let newQuiz = new Quiz(ownerId, id, items, timerLength, numQuestions, studentScores)

        // sending quiz to database
        console.log(newQuiz);
        await service.createQuiz(newQuiz);
    }
    else {
        console.log("quiz was not created/updated.");
    }

}
function defineItems() {
    // gather the input text from cell
    let questions = document.getElementsByName("Question");
    let answersA = document.getElementsByName("answerA");
    let answersB = document.getElementsByName("answerB");
    let answersC = document.getElementsByName("answerC");
    let answersD = document.getElementsByName("answerD");
    let correct = document.getElementsByName("correctAnswer");
    let items = [];
    // iterate through each row and push each to array of quiz questions
    for (let i = 0; i < questions.length; i++) {
        items.push(new Item(questions[i].value, answersA[i].value, answersB[i].value, answersC[i].value, answersD[i].value, correct[i].value));
    }
    return items;
}

export async function listQuizzes() {
    let docIds = await service.getAllQuizIDS()

    let table = document.getElementById("quizListTable");

    for (let i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
    console.log("table cleared!");
    console.log(docIds);


    for (let i = 0; i < docIds.length; i++) {

        let quiz = await service.getQuiz(docIds[i]);
        let quizId = quiz.getQuizId()

        let row = table.insertRow(-1);

        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        let cell6 = row.insertCell(5);
        let cell7 = row.insertCell(6);

        cell1.innerHTML = quizId;
        cell2.innerHTML = quiz.getQuestionCount();
        cell3.innerHTML = quiz.getOwnerId();
        cell4.innerHTML = quiz.getTimerLength();
        cell5.innerHTML = `<button onclick="window.location.href='EditQuiz.html?id=${encodeURIComponent(quizId)}'">Edit</button>`;
        cell6.innerHTML = `<button onclick="window.location.href='ScoresByQuiz.html?id=${encodeURIComponent(quizId)}'">View Scores</button>`;
        cell7.innerHTML = "<button onclick='deleteQuiz(this)'>Delete</button>";
    }
}



export async function editQuizPage() {
    // Gather and define quiz id
    const params = new URLSearchParams(window.location.search);
    const quizId = params.get('id');

    // get quiz object
    let quiz = await service.getQuiz(quizId);

    // get number of questions to show.
    // and setting input field to the length of quiz
    let length = quiz.getQuestionCount();
    document.getElementById("quizQuestionAmountInput").value = length;

    // define list for quiz items (questions)
    let items = quiz.getQuizItems();
    console.log(items);

    //setting input field to timer length
    document.getElementById("timerLengthInput").value = quiz.getTimerLength();
    // setting input field for quiz name
    document.getElementById("quizNameInput").value = quizId ;
    //reference to table
    const table = document.getElementById("quizQuestionList");
    // finding table body
    const tablebody = document.querySelector("tbody");


    // construction for length of question count
    for (let i = 0; i < items.length; i++) {
        // creating new table row
        const quizQuestionContainer = document.createElement("tr");

        let answers = items[i].getChoices();
        tablebody.appendChild(quizQuestionContainer);
        const fragment = document.createDocumentFragment();

        const question = document.createElement("td");
        const questionin  = document.createElement("input");
        questionin.type = "text";
        questionin.size = 15;
        questionin.name = "Question";
        questionin.placeholder = "Enter question";
        questionin.value = items[i].getQuestion();

        const q1 = document.createElement("td");
        const q1in = document.createElement("input");
        q1in.type = "text";
        q1in.size = 15;
        q1in.name = "answerA";
        q1in.placeholder = "Enter answer A";
        q1in.value = answers[0];


        const q2 = document.createElement("td");
        const q2in = document.createElement("input");
        q2in.type = "text";
        q2in.size = 15;
        q2in.name = "answerB";
        q2in.placeholder = "Enter answer B";
        q2in.value = answers[1];

        const q3 = document.createElement("td");
        const q3in = document.createElement("input");
        q3in.type = "text";
        q3in.size = 15;
        q3in.name = "answerC";
        q3in.placeholder = "Enter answer C";
        q3in.value = answers[2];

        const q4 = document.createElement("td");
        const q4in = document.createElement("input");
        q4in.type = "text";
        q4in.size = 15;
        q4in.name = "answerD";
        q4in.placeholder = "Enter answer D";
        q4in.value = answers[3];

        const answer = document.createElement("td");
        const answerin = document.createElement("input");
        answerin.type = "text";
        answerin.size = 15;
        answerin.name = "correctAnswer";
        answerin.placeholder = "answer (a,b,c,d)";
        console.log(items[i].getLetterAnswer());
        answerin.value = items[i].getLetterAnswer();

        question.appendChild(questionin);
        fragment.appendChild(question);
        q1.appendChild(q1in)
        fragment.appendChild(q1);
        q2.appendChild(q2in);
        fragment.appendChild(q2);
        q3.appendChild(q3in);
        fragment.appendChild(q3);
        q4.appendChild(q4in);
        fragment.appendChild(q4);
        answer.appendChild(answerin);
        fragment.appendChild(answer);

        quizQuestionContainer.appendChild(fragment);
        tablebody.appendChild(quizQuestionContainer);


    }

}

export function deleteQuiz(button) {
    const row = button.closest('tr');
    const id = row.cells[0].textContent;
    if(confirm("Are you sure you want to delete this quiz?")){
        console.log("deleting quiz " + id);
        console.log(service.deleteQuiz(id));
        listQuizzes();
    }
}

export async function listScoresQuizzes() {
    // Gather and define quiz id
    const params = new URLSearchParams(window.location.search);
    const quizId = params.get('id');

    let quiz = await service.getQuiz(quizId);
    let users = await service.getAllUserIDS();


    //reference to table
    const table = document.getElementById("scoreListTable");
    // finding table body
    const scoreContainer = document.querySelector("tbody");
    const fragment = document.createDocumentFragment();

    table.appendChild(scoreContainer);
    for (let i = 0; i < users.length; i++) {
        if(quiz.studentScores[i]) {
            // creating new table row
            const scoreEntry = document.createElement("tr");

            const usr = document.createElement("td");
            usr.textContent = quiz.studentScores[i].studentId;

            const usrScore = document.createElement("td");
            usrScore.textContent = quiz.studentScores[i].score;

            scoreEntry.appendChild(usr);
            scoreEntry.appendChild(usrScore);

            fragment.appendChild(scoreEntry);
        }
    }
    scoreContainer.appendChild(fragment);
}

export async function listScoresUsers() {
    // Gather and define quiz id
    const params = new URLSearchParams(window.location.search);
    const quizId = params.get('id');

    let quiz = await service.getQuiz(quizId);
    let users = await service.getAllUserIDS();


    //reference to table
    const table = document.getElementById("scoreListTable");
    // finding table body
    const scoreContainer = document.querySelector("tbody");
    const fragment = document.createDocumentFragment();

    table.appendChild(scoreContainer);
    for (let i = 0; i < users.length; i++) {
        if(quiz.studentScores[i]) {
            // creating new table row
            const scoreEntry = document.createElement("tr");

            const usr = document.createElement("td");
            usr.textContent = quiz.studentScores[i].studentId;

            const usrScore = document.createElement("td");
            usrScore.textContent = quiz.studentScores[i].score;

            scoreEntry.appendChild(usr);
            scoreEntry.appendChild(usrScore);

            fragment.appendChild(scoreEntry);
        }
    }
    scoreContainer.appendChild(fragment);
}

// These are crucial to making the functions work when there is an import statement
// I regret ever entertaining the idea of making this a web app ;-;
window.addTableRow = addTableRow;
window.createNewQuiz = await createNewQuiz;
window.listQuizzes = listQuizzes;
window.editQuizPage = editQuizPage;
window.deleteQuiz = deleteQuiz;
window.listScoresQuizzes = listScoresQuizzes
window.listScoresUsers = listScoresUsers;