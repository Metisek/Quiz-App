import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    GraphQLModule, // Include the GraphQL module in the imports array
  ],
})
export class AppModule {}
