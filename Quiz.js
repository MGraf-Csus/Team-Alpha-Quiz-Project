export class Quiz {
    ownerId = "TestID1";
    id = "QuizId1";
    items = [];
    timerLength = 0;
    numQuestions = 0;
    studentScores = [];

    constructor(boolean) {
        // Adding Items and Student Scores in constructor for Testing purposes.
        if (boolean) {
            this.items.push(new Item("1 + 2 = ?", ["3", "10", "3", "5"], 0));
            this.items.push(new Item("1 + 3 = ?", ["3", "11", "3", "5"], 1));
            this.items.push(new Item("1 + 4 = ?", ["3", "12", "3", "5"], 2));
            this.items.push(new Item("1 + 5 = ?", ["3", "13", "3", "5"], 3));

            this.studentScores.push(new StudentScore("stud1", 10));
            this.studentScores.push(new StudentScore("stud2", 20));
            this.studentScores.push(new StudentScore("stud3", 30));
            this.studentScores.push(new StudentScore("stud4", 40));

            this.numQuestions = this.items.length;
            this.timerLength = 180;
        }
    }
}

export class Item {
    question = "";
    choices = [];
    correctAnswer = 0;
    constructor (question, choices, answer) {
        this.question = question;
        this.choices = choices;
        this.answer = answer;
    }
}

export class StudentScore {
    studentId = "";
    score = 0;
    constructor(id, scr) {
        this.studentId = id;
        this.score = scr;
    }
}