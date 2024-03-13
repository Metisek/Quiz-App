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