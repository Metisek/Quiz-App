import { DatabaseService } from '../database.service';

const database_service = new DatabaseService();

export class queries {
    constructor() {
      database_service.connect();
    }
  
    async getQuizzes() {
      try {
        const quizzes = await database_service.query('SELECT * FROM quizapp.quiz');
        return quizzes;
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        throw new Error('Failed to fetch quizzes');
      }
    }
  
    // async getQuestions(parent, { quizId }, context) {
    //   try {
    //     const questions = await this.databaseService.query('SELECT * FROM quizapp.question WHERE quiz_id = $1', [quizId]);
    //     return questions;
    //   } catch (error) {
    //     console.error('Error fetching questions:', error);
    //     throw new Error('Failed to fetch questions');
    //   }
    // }
  }