var testDone = false;

function timer() {
    // Set the date we're counting down to
    var time = new Date();
    const timerEnd = new Date(time); // Create a new Date object to avoid modifying 'now'
    timerEnd.setHours(timerEnd.getHours() + 1); // Add one hour

    // Update the count down every 1 second
    var x = setInterval(function() {

        // Get today's date and time
        var now = new Date().getTime();
            
        // Find the distance between now and the count down date
        var distance = timerEnd - now;
            
        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
        // Output the result in an element with id="demo"
        document.getElementById("timer").innerHTML = hours + "h "
        + minutes + "m " + seconds + "s ";
            
        // If the count down is over, write some text 
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("timer").innerHTML = "EXPIRED";
        } else if (testDone == true) {
            clearInterval(x);
            document.getElementById("timer").innerHTML = hours + "h "
        + minutes + "m " + seconds + "s ";
        }
    }, 1000);
}

var lastClicked;

function answer(buttonElement) {

    if (testDone == false) {
        const selectedInput = buttonElement.textContent;

        const selectedClass = buttonElement.className;

        var questions = document.getElementsByClassName(selectedClass);

        for (let i = 0; i < questions.length; i++) {
            questions[i].style.backgroundColor = '';
        }

        buttonElement.style.backgroundColor = 'green';

        document.getElementById("answer" + selectedClass).innerHTML = selectedInput;
    }
    
}

function submitExam() {

    if (testDone == false) {

        var answers = document.getElementsByClassName('answer');

        var numCorrect = 0;

        var quizQuestions = 0;

        var quizScore = 0;

        for (let i = 0; i < answers.length; i++) {
            if (document.getElementById("correctAnswerq" + (i + 1)).innerHTML == answers[i].innerHTML){
                numCorrect += 1;
            }
            quizQuestions += 1;
        }

        quizScore = (numCorrect/quizQuestions) * 100;

        document.getElementById("score").innerHTML = quizScore + '%';

        if (quizScore == 100){
            document.getElementById("score").innerHTML += " Your Winner";
        }

        testDone = true;

    } 

}

window.timer = timer;
window.answer = answer;
window.submitExam = submitExam;