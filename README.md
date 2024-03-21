# Quiz-App
Quiz App I Nest.js learning assignment


Example of using GraphQL:

{
  getAllQuizzes {
    id
    name
  }
} - return data with all currently available quizzes

query {
  getQuestionsByQuizId(quizId: 1) {
    id,
    question_text,
    question_type
  }
} - return all guestion data for a given quiz


{
  getQuestionDetailsByType(questionId: 4) {
    id
    question_text
    question_type
    answers
    correct_answers
  }
} - gets full view for given question type in a database




mutation{QuizAdd(input:{name: "Test"})} - Adds Quiz named
mutation{QuizDelete(input:{id:54})} - Deletes Quiz with ID 54
mutation {
  QuestionAdd(input: {quizId: 1, text: "Test q", type: single_correct})
} - Adds question for a quiz id 1 with type single_correct

mutation {
  SortingQuestionUpdate(id: 3, correctAnswer: ["Declaration of Independence", "World War II", "First Moon Landing"])
} - Modifies sorting question with ID 3

More universal argument inputs were in the process of being programmed, ex.inputs for data addition, nevertheless I ran out of time.

