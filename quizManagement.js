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

        cell1.innerHTML = quizId;
        cell2.innerHTML = quiz.getQuestionCount();
        cell3.innerHTML = quiz.getOwnerId();
        cell4.innerHTML = quiz.getTimerLength();
        cell5.innerHTML = "<button onclick=\"window.location.href='EditQuiz.html'\">Edit</button>";
        cell6.innerHTML = "<button onclick='deleteQuiz(this)'>Delete</button>";
    }

}

export function editQuiz(button) {
    const row = button.closest('tr');
    const id = row.cells[0].textContent;
    let quiz = service.getQuiz(id);
    document.getElementById('quizQuestionAmountInput').value = quiz.getQuestionCount();

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

// These are crucial to making the functions work when there is an import statement
// I regret ever entertaining the idea of making this a web app ;-;
window.addTableRow = addTableRow;
window.createNewQuiz = await createNewQuiz;
window.listQuizzes = listQuizzes;
window.editQuiz = editQuiz;
window.deleteQuiz = deleteQuiz;