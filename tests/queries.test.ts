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
        
    test('Check if getting quizzes work', async () =>{ 
        const res = await query_list.getQuizzes(); 
        checkColumnValueExists(res, "name", "Example Quiz");
    });

    test('Check if getting questions for quiz 1 work', async () =>{ 
        const res = await query_list.getQuestions(1); 
        checkColumnValueExists(res, "question_text", "What is the capital of France?");
        }
    )
})