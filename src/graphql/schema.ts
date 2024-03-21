import { buildSchema } from 'graphql';
import { queries } from './queries';

const schema = buildSchema(`
  """
  Enumeration representing different types of questions.
  """
  enum QuestionType {
    SINGLE_CORRECT_ANSWER
    MULTIPLE_CORRECT_ANSWERS
    SORTING
    PLAIN_TEXT_ANSWER
  }

  """
  Represents a question in the system.
  """
  type Question {
    id: ID!
    text: String!
    type: QuestionType!
  }

  """
  Represents a quiz in the system.
  """
  type Quiz {
    id: ID!
    name: String!
  }

  """
  Input type for adding or modifying quiz data.
  """
  input QuizInput {
    id: ID
    name: String
  }

  """
  Input type for adding or modifying question data.
  """
  input QuestionInput {
    id: ID
    quizId: ID
    text: String
    type: QuestionType
  }

  """
  Input type for modifying data (add/update/delete).
  """
  input ModifyDataInput {
    operation: String!
    quizData: QuizInput
    questionData: QuestionInput
  }

  """
  Mutation operations for modifying data.
  """
  type Mutation {
    """
    Mutation to modify data (add/update/delete).
    Example usage: 
    
    mutation{
      modifyData(input:{
        operation:"add", 
        quizData:{
          name:"Test_quiz"
        }	
      })
    } - adds quiz "Test_quiz" to databasec
    """
    modifyData(input: ModifyDataInput!): String!
  }

  """
  Query operations for fetching data.
  """
  type Query {
    """
    Query to fetch all quizzes.
    """
    getAllQuizzes: [Quiz!]!

    """
    Query to fetch questions by quiz ID.
    """
    getQuestionsByQuizId(quizId: ID!): [Question!]!
  }
`);

const queryInstance = new queries();

const root = {
  modifyData: async ({ input }: { input: { operation: string, 
    quizData?: { id?: string, name?: string }, 
    questionData?: { id?: string, quizId?: string, text?: string, type?: string } } }) => {

    switch (input.operation) {
      case "add":
        switch (input.quizData ? 'quiz' : (input.questionData ? 'question' : null)) {
          case "quiz":
            if (input.quizData?.name) {
              await queryInstance.insertQuiz(input.quizData.name);
              return "Quiz added successfully";
            } else {
              return "Invalid input for adding quiz";
            }
          case "question":
            if (input.questionData?.quizId && input.questionData.text && input.questionData.type) {
              await queryInstance.insertQuestion(parseInt(input.questionData.quizId), input.questionData.text, input.questionData.type);
              return "Question added successfully";
            } else {
              return "Invalid input for adding question";
            }
          default:
            return "Invalid input";
        }
      case "delete":
        switch (input.quizData ? 'quiz' : (input.questionData ? 'question' : null)) {
          case "quiz":
            if (input.quizData?.id) {
              await queryInstance.deleteQuiz(parseInt(input.quizData.id));
              return "Quiz deleted successfully";
            } else {
              return "Invalid input for deleting quiz";
            }
          case "question":
            if (input.questionData?.id) {
              await queryInstance.deleteQuestion(parseInt(input.questionData.id));
              return "Question deleted successfully";
            } else {
              return "Invalid input for deleting question";
            }
          default:
            return "Invalid input";
        }
      case "insert":
        return 0;
      default:
        return "Invalid operation";
    }
  },
  getAllQuizzes: async () => {
    const queryInstance = new queries();
    return await queryInstance.getQuizzes();
  },
  getQuestionsByQuizId: async ({ quizId }: { quizId: string }) => {
    const queryInstance = new queries();
    return await queryInstance.getQuestions(parseInt(quizId));
  }
};

export { schema, root };
