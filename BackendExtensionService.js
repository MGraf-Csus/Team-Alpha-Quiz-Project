import { signInUsernamePassword, createAccountWithUsernamePassword, addDocument, deleteDocument, saveDocument, getDocumentData, getDocumentIDS } from "./FirebaseHandler.js"
import { Quiz } from './Quiz.js';
import { Item } from './Item.js';
import { StudentScore } from './StudentScore.js';


class BackendExtensionService {
    test = 1;

    constructor() {}

    // -------------------- Account Methods --------------------

    async signIn(username, password) {
        return await signInUsernamePassword(username, password);
    }

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
        return await addDocument("quizzes", quiz.id, this.#parseQuizForDatabase(quiz));
    }

    async editQuiz(quizId, quiz) {
        return await saveDocument("quizzes", quizId, this.#parseQuizForDatabase(quiz));
    }

    async getAllUserIDS() {
        return await getDocumentIDS("users");
    }
    async getAllQuizIDS() {
        return await getDocumentIDS("quizzes");
    }

    async getQuizTakingView(quizId) {
        return this.#setQuizQuestionsRandomToBeTakin(this.#convertToQuiz(await getDocumentData("quizzes", quizId)));
    }

    async getQuiz(quizId) {
        return this.#convertToQuiz(await getDocumentData("quizzes", quizId));
    }

    async deleteQuiz(quizId) {
        return await deleteDocument("quizzes", quizId);
    }

    // -------------------------- "Magic" Helper Functions for other methods -------------------------- //
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
            new Item(obj.question, Object.values(obj.choices), obj.correctAnswer)
        );
        const studentScores = Object.entries(parsedQuiz.studentScores).map(([studentId, score]) => new StudentScore(studentId, score));
        quiz.ownerId = parsedQuiz.ownerId;
        quiz.id = parsedQuiz.id;
        quiz.items = items;
        quiz.timerLength = parsedQuiz.timerLength;
        quiz.numQuestions = parsedQuiz.numQuestions;
        quiz.studentScores = studentScores;
        return quiz;
    }

    #setQuizQuestionsRandomToBeTakin(quiz) {
        let numQuestionsToRemove = quiz.items.length - quiz.numQuestions;
        while (numQuestionsToRemove > 0) {
            let ranNum = this.#getRandomInt(0, quiz.items.length - 1);
            quiz.items.splice(ranNum, 1);
            numQuestionsToRemove--;
        }
        let temp = quiz.items;
        quiz.items = this.#shuffle(temp);
        return quiz;
    }
    #shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); 
            [array[i], array[j]] = [array[j], array[i]]; 
        }
        return array;
    }
    #getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// Singleton export
export const service = new BackendExtensionService();
