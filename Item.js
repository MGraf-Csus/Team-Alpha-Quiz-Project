export class Item {
    question;
    choices = [];
    correctAnswer;

    constructor(question, answerA, answerB, answerC, answerD, correctAnswer) {
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
