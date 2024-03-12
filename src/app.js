const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432
});

client.connect()
  .then(() => {
    console.error('Connected to the database');

    return client.query('SELECT * from quizapp.quiz');
  })
  .then((res) => {
    console.error('Query result:', res.rows);
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.message);
  })
  .finally(() => {
    client.end();
  });
