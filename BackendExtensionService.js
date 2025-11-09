import { signInUsernamePassword, createAccountWithUsernamePassword, addDocument, deleteDocument, saveDocument, getDocumentData } from "./FirebaseHandler.js"
// import { Quiz } from './Quiz.js';
// import { Item } from './Item';
// import { StudentScore } from './StudentScore';

export class BackendExtensionService {
    test = 1;

    constructor() {}

    // -------------------- Account Methods --------------------

    // Keep in mind the database has two collections (Folders) users and quizzes by default and within
    // those collections have documents (In the form of js objects).

    // Sign in by checking email and password in 'users' collection
    async signIn(username, password) {
        return await signInUsernamePassword(username, password);
    }

    // Create a new account under 'users'
    async createAccount(adminId, username, password, role) {
        return await createAccountWithUsernamePassword(adminId, username, password, role);
    }

    async editAccount(accountId, updatedData) {
        return await saveDocument("users", accountId, updatedData);
    }

    async getAccount(accountId) {
        return await getDocumentData("users", accountId);
    }

    async deleteAccount(accountId) {
        return await deleteDocument("users", accountId);
    }

    // -------------------- Quiz Methods --------------------

    async createQuiz(quiz) {
        // console.log(this.#parseQuizForDatabase(quiz));
        console.log(quiz);
        return await addDocument("quizzes", quiz.id, this.#parseQuizForDatabase(quiz));
    }

    async editQuiz(quizId, quiz) {
        return await saveDocument("quizzes", quizId, this.#parseQuizForDatabase(quiz));
    }



    async takinQuiz() {

    }
    async manageQuiz() {

    }
    async getAllUserIDS() {

    }
    async getAllQuizeIDS() {
        
    }
 


    async getQuiz(quizId) {
        return this.#convertToQuiz(await getDocumentData("quizzes", quizId));
    }

    async deleteQuiz(quizId) {
        return await deleteDocument("quizzes", quizId);
    }

    // -------------------------- "Magic" Helper Functions for other methods --------------------------
    // Quiz method Helper funcitons for parsing quiz to be saved to DB
    #parseQuizForDatabase(quiz) {

        const itemsAsObject = Object.fromEntries(
            quiz.items.map((item, index) => [index, this.#itemToObject(item)])
        );

        const studentScoresAsObject = Object.fromEntries(
            quiz.studentScores.map(studentScore => [studentScore.studentId, studentScore.score])
        );
        
        return {
            title: "temp",
            description: "Description goes here",
            ownerId: quiz.ownerId,
            id: quiz.id,
            items: itemsAsObject,
            timerLength: quiz.timerLength,
            numQuestions: quiz.numQuestions,
            studentScores: studentScoresAsObject
        };
    }
    #itemToObject(item) {
        return {
            question: item.question,
            choices: this.#arrayToObject(item.choices),
            correctAnswer: item.correctAnswer
        };
    }
    #arrayToObject(array) {
        return Object.fromEntries(array.map((value, index) => [index, value]));
    }

    // Quiz method Helper funcitons for converting DB parsed quiz back to Quiz object
    #convertToQuiz(parsedQuiz) {
        const quiz = new Quiz();
        const items = Object.values(parsedQuiz.items).map(obj =>
            new Item(obj.question, Object.values(obj.choices), obj.answer)
        );
        const studentScores = Object.entries(parsedQuiz.studentScores).map(([studentId, score]) => new StudentScore(studentId, score));
        quiz.ownerId = parsedQuiz.ownerId;
        quiz.id = parsedQuiz.id;
        quiz.items = items;
        quiz.timerLength = parsedQuiz.timerLength;
        quiz.numQuestions = parsedQuiz.numQuestions;
        quiz.studentScores = studentScores;
    }
}
