import { queries }  from "../src/graphql/queries";
import { describe, test, expect, jest, afterEach } from "@jest/globals"

const query_list = new queries();

describe('Queries SELECT tests', () =>{

    const logSpy = jest.spyOn(global.console, 'log');

    afterEach(() => {
        logSpy.mockRestore();
    });
        
    test('Check if getting quizzes work', async () =>{ 
        const res = query_list.getQuizzes();
        if (res){
            const quizNames = res.map(item => item.name);
            expect(quizNames).toContain("Example Quiz");
   
        }
        else {
            throw new Error("Response is undefined");
        }
        
    })

    test('Check if getting questions for quiz 1 work', async () =>{ 
        const res = query_list.getQuestions(1);
        expect(res).toContain("aaaaaaa");
    })
    
})