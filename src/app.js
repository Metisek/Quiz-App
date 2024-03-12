const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from cred.env

// Create a PostgreSQL client instance
const client = new Client({
  user: process.env.POSTGRES_USER,
  host: 'quizapp.northeurope.cloudapp.azure.com', // Update the host here
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432, // Default PostgreSQL port
});

// Connect to the PostgreSQL database
client.connect()
  .then(() => {
    console.log('Connected to the database');
    // Perform database operations here
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.message);
  });

// Example query
client.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error executing query:', err.message);
  } else {
    console.log('Query result:', res.rows);
  }
});

// Close the database connection when done
client.end();
