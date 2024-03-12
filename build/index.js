"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const users = [
    { id: 1, name: "John Doe", email: "johndoe@gmail.com" },
    { id: 2, name: "Jane Doe", email: "janedoe@gmail.com" },
    { id: 3, name: "Mike Doe", email: "mikedoe@gmail.com" },
];
const schema = (0, graphql_1.buildSchema)(`
    input UserInput {
        email: String!
        name: String!

    }

    type User {
        id: Int!
        name: String!
        email: String!
    }

    type Mutation {
        createUser(input: UserInput): User
        updateUser(id: Int!, input: UserInput): User
    }

    type Query {
        getUser(id: String): User
        getUsers: [User]
    }
`);
const getUser = (args) => users.find(u => u.id === args.id);
const getUsers = () => users;
const createUser = (args) => {
    const user = {
        id: users.length + 1,
        ...args.input,
    };
    users.push(user);
    return user;
};
const updateUser = (args) => {
    const index = users.findIndex(u => u.id === args.user.id);
    const targetUser = users[index];
    if (targetUser)
        users[index] = args.user;
    return targetUser;
};
const root = {
    getUser,
    getUsers,
    createUser,
    updateUser,
};
const app = (0, express_1.default)();
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
const PORT = 3000;
app.listen(PORT);
console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);
