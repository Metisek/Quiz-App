import { queries }  from "../src/graphql/queries";
import { describe, test, expect, jest, afterEach } from "@jest/globals"

const query_list = new queries();

async function checkColumnValueExists(res:any, columnName:string, expectedValue:any) {
    if (res) {
        const ex_vals = res.map((item:any) => item[columnName]);
        expect(ex_vals).toContain(expectedValue);
    } else {
        throw new Error("Response is undefined");
    }
}

describe('Queries SELECT tests', () =>{

    const logSpy = jest.spyOn(global.console, 'log');

    afterEach(() => {
        logSpy.mockRestore();
    });
        
    test('Check getting quizzez', async () =>{ 
        const res = await query_list.getQuizzes(); 
        checkColumnValueExists(res, "name", "Example Quiz");
    });

    test('Check getting questions from quiz 1', async () =>{ 
        const res = await query_list.getQuestions(1); 
        checkColumnValueExists(res, "question_text", "What is the capital of France?");
        }
    )

    test('Check quiz insertion', async () =>{ 
        await query_list.insertQuiz("DELETE_ME"); 
        const res = await query_list.getQuizzes(); 
        checkColumnValueExists(res, "name", "DELETE_ME");
        }
    )

    test('Check question insertion quiz 1 correct data', async () =>{ 
        const quiz = await query_list.getQuizzes();
        const last_quiz= quiz[quiz.length - 1]?.id;
        await query_list.insertQuestion(last_quiz, "Test Question", "single_correct"); 
        await query_list.insertQuestion(last_quiz, "Test Question", "single_correct"); 
        const res = await query_list.getQuestions(last_quiz); 
        checkColumnValueExists(res, "question_text", "Test Question");
        }
    )

    // test('Check question deletion', async () =>{ 
    //     const quiz = await query_list.getQuizzes();
    //     const last_quiz= quiz[quiz.length - 1]?.id;
    //     const question = await query_list.getQuestions(last_quiz);
    //     const last_question = question[question.length - 1]?.id;
    //     await query_list.deleteQuestion(last_question); 
    //     }
    // )
    
    // test('Check quiz deletion', async () =>{ 
    //     const quiz = await query_list.getQuizzes();
    //     const last_quiz= quiz[quiz.length - 1]?.id;
    //     await query_list.deleteQuiz(last_quiz); 
    //     }
    // )

    test('Update quiz name', async () => {
        const quizId = 34;
        const newQuizName = 'New Quiz Name';
    
        await query_list.updateQuizName(quizId, newQuizName);
    })

    test('Update question text', async () => {   
        const questionId = 97;
        const newQuestionText = 'New Question Text';
    
        await query_list.updateQuestionText(questionId, newQuestionText);
    })

    test('Update single correct answer question', async () => {
        const questionId = 97;
        const correctAnswer = 'Paris';
        const answers = ['Paris', 'Warsaw', 'London', 'Rome'];
        await query_list.updateSingleCorrectAnswerQuestion(questionId, correctAnswer, answers);
    })

    test('Update multiple correct answers question', async () => {
        const questionId = 98;
        const correctAnswer = ['Java','Python','Ruby'];
        const answers = ['Java','Python','Ruby','C','Assembler'];
        await query_list.updateMultipleCorrectAnswersQuestion(questionId, correctAnswer, answers);
    })

    test('Update sorting question', async () => {
        const questionId = 99;
        const correctAnswer = ['Declaration of Independencee','World War II','First Moon Landing'];
        await query_list.updateSortingQuestion(questionId, correctAnswer);
    })

    test('Update plain text question', async () => {
        const questionId = 100;
        const correctAnswer = 'May the force be with you';
        await query_list.updatePlainTextAnswerQuestion(questionId, correctAnswer);
    })
})