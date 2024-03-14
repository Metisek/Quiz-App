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

    test('Check question deletion', async () =>{ 
        const quiz = await query_list.getQuizzes();
        const last_quiz= quiz[quiz.length - 1]?.id;
        const question = await query_list.getQuestions(last_quiz);
        const last_question = question[question.length - 1]?.id;
        await query_list.deleteQuestion(last_question); 
        }
    )
    
    test('Check quiz deletion', async () =>{ 
        const quiz = await query_list.getQuizzes();
        const last_quiz= quiz[quiz.length - 1]?.id;
        await query_list.deleteQuiz(last_quiz); 
        }
    )

})