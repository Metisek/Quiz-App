import { Query } from '@nestjs/graphql';
import { queries } from './queries'; // Import the queries class from queries.ts

const queriesService = new queries(); // Create an instance of the queries class


const resolvers_list = {
  Query: {
    getQuizzes: async () => {
      try {
        // Call the getQuizzes method of the queries service
        const quizzes = await queriesService.getQuizzes();
        return quizzes;
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        throw new Error('Failed to fetch quizzes');
      }
    },
    // getQuestions: async (parent, { quizId }, context) => {
    //   try {
    //     // Call the getQuestions method of the queries service
    //     const questions = await queriesService.getQuestions(quizId);
    //     return questions;
    //   } catch (error) {
    //     console.error('Error fetching questions:', error);
    //     throw new Error('Failed to fetch questions');
    //   }
    // },
  },
};

const resolvers = {
    getQuizzes: resolvers_list.Query.getQuizzes
  };

export default resolvers;
