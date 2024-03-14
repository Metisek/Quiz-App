import { buildSchema } from 'graphql';
import { queries } from './queries';

const schema = buildSchema(`
  type Question {
    id: ID!
    question_text: String!
    question_type: String!
  }

  type Quiz {
    id: ID!
    name: String!
  }

  type Query {
    getAllQuizzes: [Quiz!]!
    getQuestionsByQuizId(quizId: ID!): [Question!]!
  }
`);

const root = {
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
