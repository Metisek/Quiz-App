import { buildSchema } from 'graphql';
import { queries } from './queries';

const schema = buildSchema(`
  enum QuestionType {
    single_correct
    multiple_correct
    sorting
    plain_text
  }

  type Question {
    id: ID!
    text: String!
    type: QuestionType!
  }

  type Quiz {
    id: ID!
    name: String!
  }

  type SingleCorrectAnswerQuestion {
    id: ID!
    questionID: ID!
    correctAnswer: String!
    answers: [String!]
  }

  type MultipleCorrectAnswersQuestion {
    id: ID!
    questionID: ID!
    correctAnswer: [String!]
    answers: [String!]
  }

  type SortingQuestion {
    id: ID!
    questionID: ID!
    correctOrder: [String!]
  }

  type PlainTextAnswerQuestion {
    id: ID!
    questionID: ID!
    correctAnswer: String!
  }

  input QuizInput {
    id: ID
    name: String
  }

  input QuestionInput {
    id: ID
    quizId: ID
    text: String
    type: QuestionType
  }

  input ModifyDataInput {
    operation: String!
    quizData: QuizInput
    questionData: QuestionInput
  }

  input QuestionAddInput{
    name: String!
    type: QuestionType!
  }

  type QuizAddInput{
    name: String!
  }

  type Mutation {
    QuizAdd(input: QuizInput!): String!
    QuestionAdd(input: QuestionAddInput!): String!
    QuizDelete(quizId: ID!): String!
    QuestionDelete(questionId: ID!): String!
  }

  type Query {
    getAllQuizzes: [Quiz!]!
    getQuestionsByQuizId(quizId: ID!): [Question!]!
  }
`);
const queryInstance = new queries();

const root = {
  QuestionAdd: async ({ input }: { input: { id?: string, quizId?: string, text: string, type: string } }) => {

    if (input.quizId && input.text && input.type) {
      await queryInstance.insertQuestion(parseInt(input.quizId), input.text, input.type);
      return "Question added successfully";
    } else {
      return "Invalid input for adding question";
    }
  },
  QuizAdd: async ({ input }: { input: { id?: string, name: string } }) => {
    if (input.name) {
      await queryInstance.insertQuiz(input.name);
      return "Quiz added successfully";
    } else {
      return "Invalid input for adding quiz";
    }
  },
  QuizDelete: async ({ quizId }: { quizId: string }) => {
    if (quizId) {
      await queryInstance.deleteQuiz(parseInt(quizId));
      return "Quiz deleted successfully";
    } else {
      return "Invalid input for deleting quiz";
    }
  },
  QuestionDelete: async ({ questionId }: { questionId: string }) => {
    if (questionId) {
      await queryInstance.deleteQuestion(parseInt(questionId));
      return "Question deleted successfully";
    } else {
      return "Invalid input for deleting question";
    }
  },
  getAllQuizzes: async () => {
    return await queryInstance.getQuizzes();
  },
  getQuestionsByQuizId: async ({ quizId }: { quizId: string }) => {
    return await queryInstance.getQuestions(parseInt(quizId));
  }
};

export { schema, root };
