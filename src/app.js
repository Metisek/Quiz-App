// Import necessary modules
const { createServer } = require('http');
const { GraphQLServer } = require('graphql-yoga');

// Define your GraphQL schema
const typeDefs = `
  type Query {
    hello: String
  }
`;

// Define resolvers for the schema
const resolvers = {
  Query: {
    hello: () => 'Hello from Yoga!'
  }
};

// Create the GraphQL server
const server = new GraphQLServer({
  typeDefs,
  resolvers
});

// Start the server
server.start({ port: 3000 }, () => {
  console.log('Server is running on http://localhost:3000');
});
