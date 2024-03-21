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

  type DetailedQuestion {
    id: ID!
    question_id: ID!
    question_text: String!
    question_type: QuestionType!
    answers: [String]
    correct_answers: [String]

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

"""Add"""

  input QuizAddInput {
    name: String
  }

  input QuestionAddInput {
    quizId: ID
    text: String
    type: QuestionType
  }


  input QuizDeleteInput {
    id: ID
  }

  input QuestionDeleteInput {
    id: ID
  }

  input ModifyDataInput {
    operation: String!
    quizData: QuizInput
    questionData: QuestionInput
  }

  type Mutation {
    QuestionAdd(input: QuestionAddInput!): String!
    QuizAdd(input: QuizAddInput!): String!
    QuizDelete(input: QuizDeleteInput!): String!
    QuestionDelete(input: QuestionDeleteInput!): String!
    QuizUpdateName(quizId: ID!, newName: String!): String!
    QuestionUpdateText(questionId: ID!, newText: String!): String!
    SingleCorrectQuestionUpdate(id: ID!, correctAnswer: String!, answers: [String!]!): String!
    MultipleCorrectQuestionUpdate(id: ID!, correctAnswer: [String!]!, answers: [String!]!): String!
    SortingQuestionUpdate(id: ID!, correctAnswer: [String!]!): String!
    PlainTextQuestionUpdate(id: ID!, correctAnswer: String!): String!
  }

  type Query {
    getAllQuizzes: [Quiz!]!
    getQuestionsByQuizId(quizId: ID!): [Question!]!
    getQuestionDetailsByType(questionId: ID!): DetailedQuestion
  }
`);

const queryInstance = new queries();

const root = {
  QuestionAdd: async ({ input }: { input: { id?: string, quizId?: string, text: string, type: string } }) => {
    const validQuestionTypes = ["single_correct", "multiple_correct", "sorting", "plain_text"];
    if (input.quizId && input.text && input.type && validQuestionTypes.includes(input.type)) {
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
  QuizDelete: async ({ input }: { input: { id?: string } }) => {
    if (input.id) {
      if (await queryInstance.doesQuizExist(parseInt(input.id))){
        await queryInstance.deleteQuiz(parseInt(input.id));
        return "Quiz deleted successfully";
      }
      else{
        return "Quiz with given ID does not exist";
      }

      
    } else {
      return "Invalid input for deleting quiz";
    }
  },

  QuestionDelete: async ({ input }: { input: {id: string }}) => {
    if (input.id) {
      if (await queryInstance.doesQuestionExist(parseInt(input.id))){
        await queryInstance.deleteQuestion(parseInt(input.id));
        return "Question deleted successfully";  
      } else {
        return "Question with given ID does not exist";
      }
    } else {
      return "Invalid input for deleting question";
    }
  },

  QuizUpdateName: async ({ quizId, newName }: { quizId: string, newName: string }) => {
    if (quizId && newName) {
      await queryInstance.updateQuizName(parseInt(quizId), newName);
      return "Quiz name updated successfully";
    } else {
      return "Invalid input for updating quiz name";
    }
  },
  QuestionUpdateText: async ({ questionId, newText }: { questionId: string, newText: string }) => {
    if (questionId && newText) {
      await queryInstance.updateQuestionText(parseInt(questionId), newText);
      return "Question text updated successfully";
    } else {
      return "Invalid input for updating question text";
    }
  },
  SingleCorrectQuestionUpdate: async ({ id, correctAnswer, answers }: { id: string, correctAnswer: string, answers: string[] }) => {
    if (id && correctAnswer && answers && correctAnswer in answers) {
      await queryInstance.updateSingleCorrectAnswerQuestion(parseInt(id), correctAnswer, answers);
      return "Single correct answer question updated successfully";
    } else {
      return "Invalid input for updating single correct answer question";
    }
  },
  MultipleCorrectQuestionUpdate: async ({ id, correctAnswer, answers }: { id: string, correctAnswer: string[], answers: string[] }) => {
    if (id && correctAnswer && answers) {
      const allCorrectAnswersExist = correctAnswer.every(answer => answers.includes(answer));
      if (allCorrectAnswersExist){
        await queryInstance.updateMultipleCorrectAnswersQuestion(parseInt(id), correctAnswer, answers);
        return "Multiple correct answers question updated successfully";  
      } else {
        return "Invalid input for updating multiple correct answers question";
      }
    } else {
      return "Invalid input for updating multiple correct answers question";
    }
  },
  SortingQuestionUpdate: async ({ id, correctAnswer }: { id: string, correctAnswer: string[] }) => {
    if (id && correctAnswer) {
      await queryInstance.updateSortingQuestion(parseInt(id), correctAnswer);
      return "Sorting question updated successfully";
    } else {
      return "Invalid input for updating sorting question";
    }
  },
  PlainTextQuestionUpdate: async ({ id, correctAnswer }: { id: string, correctAnswer: string }) => {
    if (id && correctAnswer) {
      await queryInstance.updatePlainTextAnswerQuestion(parseInt(id), correctAnswer);
      return "Plain text answer question updated successfully";
    } else {
      return "Invalid input for updating plain text answer question";
    }
  },
  getAllQuizzes: async () => {
    return await queryInstance.getQuizzes();
  },
  getQuestionsByQuizId: async ({ quizId }: { quizId: string }) => {
    return await queryInstance.getQuestions(parseInt(quizId));
  },
  getQuestionDetailsByType: async ({ questionId }: { questionId: string }) => {
    if (!(await queryInstance.doesQuestionExist(parseInt(questionId)))) {
      console.error(`Question with ID ${questionId} not found`);
      throw new Error(`Question with ID ${questionId} not found`);
    }
  
    const questionType = await queryInstance.getQuestionType(parseInt(questionId));
  
    if (questionType) {
      switch (questionType.question_type) {
        case "multiple_correct":
          return await queryInstance.getMultipleCorrectAnswerDetails(parseInt(questionId));
        case "sorting":
          return await queryInstance.getSortingQuestionDetails(parseInt(questionId));
        case "plain_text":
          return await queryInstance.getPlainTextAnswerQuestionDetails(parseInt(questionId));
        case "single_correct":
        default:
          return await queryInstance.getSingleCorrectAnswerDetails(parseInt(questionId));
      }
    } else {
      console.error(`Question type not found for ID ${questionId}`);
      throw new Error(`Question type not found for ID ${questionId}`);
    }
  }
};

export { schema, root };