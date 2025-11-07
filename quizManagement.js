import {BackendExtensionService} from "./BackendExtensionService.js";
import {Item} from "./Item.js";
import {Quiz} from "./Quiz.js";
import {StudentScore} from "./StudentScore.js";

function addTableRow() {
    let table = document.getElementById("quizQuestionList");
    let row = table.insertRow(-1);

    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);

    cell1.innerHTML = "<input type='text' size='15' id='Question' name='Question' placeholder='Enter question'>";
    cell2.innerHTML = "<input type='text' size='15' id='answerA' name='answerA' placeholder='Enter answer A'>";
    cell3.innerHTML = "<input type='text' size='15' id='answerB' name='answerB' placeholder='Enter answer B'>";
    cell4.innerHTML = "<input type='text' size='15' id='answerC' name='answerC' placeholder='Enter answer C'>";
    cell5.innerHTML = "<input type='text' size='15' id='answerD' name='answerD' placeholder='Enter answer D'>";
    cell6.innerHTML = "<input type='text' size='11' id='correctAnswer' name='correctAnswer' placeholder='answer (a,b,c,d)'>";

}

let service = new BackendExtensionService();
async function createNewQuiz() {
    // TEMP VALUE
    let ownerId = "1";


    let id = document.getElementById("quizNameInput").value;
    let items = defineItems();
    let timerLength = document.getElementById("timerLengthInput").value;
    let numQuestions = document.getElementById("quizQuestionAmountInput").value;
    let studentScores = [];

    let newQuiz = new Quiz(ownerId, id, items, timerLength, numQuestions, studentScores)

    console.log(newQuiz);
    await service.createQuiz(newQuiz);
}
function defineItems() {
    let questions = document.getElementsByName("Question");
    let answersA = document.getElementsByName("answerA");
    let answersB = document.getElementsByName("answerB");
    let answersC = document.getElementsByName("answerC");
    let answersD = document.getElementsByName("answerD");
    let correct = document.getElementsByName("correctAnswer");
    let items = [];
    for (let i = 0; i < questions.length; i++) {
        items.push(new Item(questions[i].value, answersA[i].value, answersB[i].value, answersC[i].value, answersD[i].value, correct[i].value));
    }
    return items;

}


// These are crucial to making the functions work when there is an import statement
// I regret ever entertaining the idea of making this a web app ;-;
window.addTableRow = addTableRow;
window.createNewQuiz = await createNewQuiz;