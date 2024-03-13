import { Client } from 'pg';
import * as dotenv from 'dotenv';

export class DatabaseService {
  private client: Client;

  constructor() {
    dotenv.config();
    this.client = new Client({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: 5432,
      ssl: {
        rejectUnauthorized: false, // self-signed, would use CA in production
      },
    });
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('Connected to the database');
    } catch (err) {
      if (err instanceof Error){
        console.error('Error connecting to the database:', err.message);
      }
    }
  }

  async query(sql: string) {
    try {
      const res = await this.client.query(sql);
      return(res.rows)
    } catch (err) {
      if (err instanceof Error){
          console.error('Error executing query:', err.message);
      }
    } 
  }
}
