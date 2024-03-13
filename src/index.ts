import { buildSchema } from "graphql"
import express from "express"
import { graphqlHTTP } from "express-graphql"
import schema from "./graphql/schema"
import resolvers from "./graphql/resolvers"


const app = express()

app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: resolvers,
        graphiql: true,
    })
)

const PORT = 3000

app.listen(PORT)

console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`)


// import { DatabaseService } from './database.service';

// async function main() {
//   const databaseService = new DatabaseService();

//   // Connect to the database
//   await databaseService.connect();

//   // Example queries
//   await databaseService.query('SELECT * FROM quizapp.question');
// //   await databaseService.query('INSERT INTO your_table (column1, column2) VALUES (value1, value2)');

//   // Close the database connection
//   // Note: Since you're using 'await' in the query method, the connection will be closed automatically after each query.
//   // So you may not need to explicitly call databaseService.close() here.
// }

// main().catch((error) => {
//   console.error('Error:', error);
// });
