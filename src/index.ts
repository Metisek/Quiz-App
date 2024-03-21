import express from "express"
import { graphqlHTTP } from "express-graphql"
import { schema, root } from "./graphql/schema"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
    )      
  await app.listen(PORT);
  console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`)
}

bootstrap();

