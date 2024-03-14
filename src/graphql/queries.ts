import { DatabaseService } from '../database.service';

const database_service = new DatabaseService();

export class queries {
    constructor() {
      database_service.connect();
    }
  // Method for checking if query connects properly
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
  
    
    
  }