import { DatabaseService } from '../database.service';

const database_service = new DatabaseService();

export class queries {
    constructor() {
        database_service.connect();
    }

    // Begin a transaction
    async startTransaction() {
        try {
            await database_service.query('BEGIN');
            console.log('Transaction started');
        } catch (error) {
            console.error('Failed to start transaction:', error);
            throw new Error('Failed to start transaction');
        }
    }

    // Commit a transaction
    async commitTransaction() {
        try {
            await database_service.query('COMMIT');
            console.log('Transaction committed');
        } catch (error) {
            console.error('Failed to commit transaction:', error);
            throw new Error('Failed to commit transaction');
        }
    }

    // Rollback a transaction
    async rollbackTransaction() {
        try {
            await database_service.query('ROLLBACK');
            console.log('Transaction rolled back');
        } catch (error) {
            console.error('Failed to roll back transaction:', error);
            throw new Error('Failed to roll back transaction');
        }
    }

    // Method for checking if select query returns data
    async selectQueryValidation(query: string, errorText: string, params: any[] = []) {
        try {
            const data = await database_service.query(query, ...params);
            if (data) {
                return data;
            } else {
                throw new Error('Response is empty');
            }

        } catch (error) {
            console.error(errorText, error);
            throw new Error(errorText);
        }
    }

    // Method for checking if data manipulation works
    async mutationValidation(query: string, errorText: string, params: any[] = []) {
        try {
            await database_service.query(query, ...params);
            console.log('Data operation completed successfully');
        } catch (error) {
            console.error(errorText, error);
            throw new Error("Failed to manipulate data");
        }
    }

    // Getters
    async getQuizzes() {
        return this.selectQueryValidation('SELECT * FROM quizapp.quiz',
            'Failed to fetch quizzes');
    }

    async getQuestions(quizId: number) {
        return this.selectQueryValidation('SELECT * FROM quizapp.question WHERE quiz_id = $1',
            'Failed to fetch questions from given quiz', [quizId]);
    }

    // Data inserts
    async insertQuestion(quiz_id: number, question_text: string, question_type: string) {
        return this.mutationValidation(`INSERT INTO quizapp.question (quiz_id, question_text, question_type) VALUES ($1, $2, $3)`,
            'Failed to insert question', [quiz_id, question_text, question_type]);
    }

    async insertQuiz(name: string) {
        return this.mutationValidation(`INSERT INTO quizapp.quiz (id, name) VALUES (DEFAULT, $1)`,
            'Failed to insert quiz', [name]);
    }

    // Data deletion

    async deleteQuiz(quizId: number) {
        return this.mutationValidation(`DELETE FROM quizapp.quiz WHERE id = $1`,
            "Failed to delete quiz", [quizId]);
    }

    async deleteQuestion(questionId: number) {
        return this.mutationValidation(`DELETE FROM quizapp.question WHERE id = $1`,
            "Failed to delete question", [questionId]);
    }


    // Data modification
    async updateQuizName(quizId: number, newName: string) {
        return this.mutationValidation(`UPDATE quizapp.quiz SET name = $1 WHERE id = $2`,
            "Failed to update quiz name", [newName, quizId]);
    }

    async updateQuestionText(questionId: number, newText: string) {
        const existingQuestion = await this.getQuestionById(questionId);
        if (existingQuestion) {
            return this.mutationValidation(`UPDATE quizapp.question SET question_text = $1 WHERE id = $2`,
                "Failed to update quiz name", [newText, questionId]);
        }
    }

    async updateSingleCorrectAnswerQuestion(id: number, correctAnswer: string, answers: string[]) {
        const query = `
            UPDATE quizapp.single_correct_answer_question
            SET correct_answer = $1,
                answers = $2
            WHERE id = $3
        `;
        return this.mutationValidation(query, `Failed to update single correct answer question with ID ${id}`, [correctAnswer, answers, id]);
    }

    async updateMultipleCorrectAnswersQuestion(id: number, correctAnswer: string[], answers: string[]) {
        const query = `
        UPDATE quizapp.multiple_correct_answers_question
        SET correct_answers = $1,
            answers = $2
        WHERE id = $3
    `;
        return this.mutationValidation(query, `Failed to update multiple correct answers question with ID ${id}`,
            [`{${correctAnswer.join(',')}}`, `{${answers.join(',')}}`, id]);
    }

    async updateSortingQuestion(id: number, correctAnswer: string[]) {
        const query = `
        UPDATE quizapp.sorting_question
        SET correct_order = $1
        WHERE id = $2
    `;
        return this.mutationValidation(query, `Failed to update sorting question with ID ${id}`,
            [`{${correctAnswer.join(',')}}`, id]);
    }

    async updatePlainTextAnswerQuestion(id: number, correctAnswer: string) {
        const query = `
        UPDATE quizapp.plain_text_answer_question
        SET correct_answer = $1
        WHERE id = $2
    `;
        return this.mutationValidation(query, `Failed to update plain text answer question with ID ${id}`, [correctAnswer, id]);
    }

    // Private getters

    private async getQuestionById(questionId: number) {
        const query = `SELECT * FROM quizapp.question WHERE id = $1`;
        const result = await database_service.query(query, questionId);
        if (result) {
            return result[0];
        } else {
            console.error("Failed to get question with id:", questionId);
            throw new Error("Failed to update queston");
        }
    }

    // Transaction methods

    // Method for checking if transaction query returns data
    async transactionQueryValidation(query: string, errorText: string, params: any[] = []) {
        try {
            const data = await database_service.query(query, ...params);
            if (data) {
                return data;
            } else {
                throw new Error('Response is empty');
            }

        } catch (error) {
            console.error(errorText, error);
            throw new Error(errorText);
        }
    }

    // Method for checking if transaction operation works
    async transactionOperationValidation(query: string, errorText: string, params: any[] = []) {
        try {
            await database_service.query(query, ...params);
            console.log('Transaction operation completed successfully');
        } catch (error) {
            console.error(errorText, error);
            throw new Error("Failed to perform transaction operation");
        }
    }

    // Method to execute a transaction
    async executeTransaction(operations: (() => Promise<any>)[]) {
        try {
            await this.startTransaction();
            for (const operation of operations) {
                await operation();
            }
            await this.commitTransaction();
            console.log('Transaction executed successfully');
        } catch (error) {
            await this.rollbackTransaction();
            console.error('Transaction failed:', error);
            throw new Error('Transaction failed');
        }
    }
}