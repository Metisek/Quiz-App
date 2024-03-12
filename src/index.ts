import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller()
export class AppController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async getData() {
    await this.databaseService.connect();
    await this.databaseService.query('SELECT * FROM quizapp.quiz');
  }
}
