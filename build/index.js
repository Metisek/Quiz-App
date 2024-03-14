"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const schema_1 = __importDefault(require("./graphql/schema"));
const resolvers_1 = __importDefault(require("./graphql/resolvers"));
const app = (0, express_1.default)();
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema: schema_1.default,
    rootValue: resolvers_1.default,
    graphiql: true,
}));
const PORT = 3000;
app.listen(PORT);
console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);
