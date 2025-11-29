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
        let abcd;
        switch (correctAnswer) {
            case 'a':
                abcd = 1;
            case 'b':
                abcd = 2;
            case 'c':
                abcd = 3;
            case 'd':
                abcd = 4;
        }
        this.correctAnswer = abcd;
    }

    getQuestion() {
        return this.question;
    }
    getChoices() {
        return this.choices;
    }
    getLetterAnswer() {
        switch (this.correctAnswer) {
            case 1:
                return 'a';
            case 2:
                return 'b';
            case 3:
                return 'c';
            case 4:
                return 'd';
        }
    }
    getCorrectAnswer(answer) {
        return this.correctAnswer;
    }
}
