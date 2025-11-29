export class Quiz {
    ownerId;
    id;
    items = [];
    timerLength;
    numQuestions;
    studentScores = [];
    constructor(ownerId, id, items, timerLength, numQuestions, studentScores) {
        this.ownerId = ownerId;
        this.id = id;
        this.items = items;
        this.timerLength = timerLength;
        this.numQuestions = numQuestions;
    }
    getOwnerId() {
        return this.ownerId;
    }
    getQuizId() {
        return this.id;
    }
    getQuizItems() {
        return this.items;
    }
    getTimerLength() {
        return this.timerLength;
    }
    getQuestionCount() {
        return this.numQuestions;
    }

}