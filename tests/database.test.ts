import { DatabaseService } from "../src/database.service";
import { describe, test, expect, jest, afterEach } from "@jest/globals"

const database = new DatabaseService();

describe('Connection tests', () =>{

    const logSpy = jest.spyOn(global.console, 'log');

    afterEach(() => {
        logSpy.mockRestore();
    });
        
    test('Check if database connects', async () =>{ 
        await database.connect();  
        expect(logSpy).toHaveBeenCalled();
        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith('Connected to the database');   
    })

    test('Check if query works', async () =>{ 
        const res = await database.query('SELECT * FROM quizapp.quiz');  
        if (res){
            const quizNames = res.map(item => item.name);
            expect(quizNames).toContain("Example Quiz");
   
        }
        else {
            throw new Error("Response is undefined");
        }
    })
    
})