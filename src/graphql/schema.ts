import { buildSchema } from 'graphql';

const schema = buildSchema(`
  enum QuestionType {
    SINGLE_CORRECT_ANSWER
    MULTIPLE_CORRECT_ANSWERS
    SORTING
    PLAIN_TEXT_ANSWER
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

  input AddQuizInput {
    name: String!
  }

  input AddQuestionInput {
    quizId: ID!
    text: String!
    type: QuestionType!
  }

  type Query {
    getQuizzes: [Quiz!]!
    getQuestions(quizId: ID!): [Question!]!
  }

  type Mutation {
    addQuiz(input: AddQuizInput!): Quiz!
    addQuestion(input: AddQuestionInput!): Question!
  }
`);

export default schema;
