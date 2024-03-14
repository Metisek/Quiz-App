import { DatabaseService } from '../database.service';

const database_service = new DatabaseService();

export class queries {
    constructor() {
      database_service.connect();
    }
  // Method for checking if query select is correct
  async select_query_validation(query:string, error_text:string ){
    try {
      const data = await database_service.query(query);
      if (data){
        return data;
      }
      else{
        throw new Error('Response is empty');
      }
      
    } catch (error) {
      console.error(error_text, error);
      throw new Error(error_text);
    }
  }

  // Getters
  // Method for checking if query connects properly
  async selectQueryValidation(query: string, errorText: string, params: any[] = []) {
    try {
      const data = await database_service.query(query, ...params);
      if (data){
          return data;
      }else {
        throw new Error('Response is empty');
      }

    } catch (error) {
      console.error(errorText, error);
      throw new Error(errorText);
    }
  }

  // Getters
  async getQuizzes() {
    return this.selectQueryValidation('SELECT * FROM quizapp.quiz', 'Failed to fetch quizzes');
  }

  async getQuestions(quizId: number) {
    return this.selectQueryValidation('SELECT * FROM quizapp.question WHERE quiz_id = $1', 'Failed to fetch questions from given quiz', [quizId]);
  }

  // Data inserts
    async insertQuestion(quiz_id: number, question_text: string, question_type: string) {
      try {
      const query = `INSERT INTO quizapp.question (quiz_id, question_text, question_type) VALUES ($1, $2, $3)`;
      await database_service.query(query, quiz_id, question_text, question_type);
      console.log('Question inserted successfully');
    } catch (error) {
      console.error("Failed to insert question:", error);
      throw new Error("Failed to insert question");
    }
  }
  
  async insertQuiz(name: string) {
    try {
      const query = `INSERT INTO quizapp.quiz (id, name) VALUES (DEFAULT, $1)`;
      await database_service.query(query, name);
      console.log('Quiz inserted successfully');
    } catch (error) {
      console.error("Failed to insert quiz:", error);
      throw new Error("Failed to insert quiz");
    }
  }

  // Data deletion

  async deleteQuiz(quizId: number) {
    try {
      const query = `DELETE FROM quizapp.quiz WHERE id = $1`;
      await database_service.query(query, String(quizId));
      console.log('Quiz deleted successfully');
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      throw new Error("Failed to delete quiz");
    }
  }

  async deleteQuestion(questionId: number) {
    try {
      const query = `DELETE FROM quizapp.question WHERE id = $1`;
      await database_service.query(query, String(questionId));
      console.log('Question deleted successfully');
    } catch (error) {
      console.error("Failed to delete question:", error);
      throw new Error("Failed to delete question");
    }
  }
  
  // Data modification
  async updateQuizName(quizId: number, newName: string) {
    try {
      const query = `UPDATE quizapp.quiz SET name = $1 WHERE id = $2`;
      await database_service.query(query, newName, quizId);
      console.log(`Quiz name updated successfully`);
    } catch (error) {
      console.error("Failed to update quiz name:", error);
      throw new Error("Failed to update quiz name");
    }
  }

  async updateQuestionText(questionId: number, newText: string) {
    try {
      // Get the existing question to retain question_type
      const existingQuestion = await this.getQuestionById(questionId);
      if (existingQuestion) {
        const query = `UPDATE quizapp.question SET question_text = $1 WHERE id = $2`;
        await database_service.query(query, newText, questionId)
      } else {
        console.error(`Question with ID ${questionId} not found.`);
      }
    } catch (error) {
      console.error("Failed to update question text:", error);
      throw new Error("Failed to update question text");
    }
  }

  // Private getters

  private async getQuestionById(questionId: number) {
    const query = `SELECT * FROM quizapp.question WHERE id = $1`;
    const result = await database_service.query(query, questionId);
    if (result) {
      return result[0];
    }else{
      console.error("Failed to get question with id:", questionId);
      throw new Error("Failed to update queston");
    }
  }

    
}