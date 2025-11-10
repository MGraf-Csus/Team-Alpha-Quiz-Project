export class Item {
    question;
    choices = [];
    correctAnswer;

    constructor(question, answerA, answerB, answerC, answerD, correctAnswer) {

        // Added Case for when array of choices is passed easier for DB to handle when retrieving
        if (Array.isArray(answerA)) {
            this.question = question;
            this.choices = answerA;
            this.correctAnswer = answerB; // b holds the value for correctAnswer in this case already an int
            return;
        }

        // Default case
        this.question = question;
        this.choices.push(answerA);
        this.choices.push(answerB);
        this.choices.push(answerC);
        this.choices.push(answerD);
        this.correctAnswer = this.getCorrectAnswer(correctAnswer);
    }

    getCorrectAnswer(answer)
    {
        switch (answer) {
            case 'a':
                return 1;
            case 'b':
                return 2;
            case 'c':
                return 3;
            case 'd':
                return 4;
        }
    }
}
