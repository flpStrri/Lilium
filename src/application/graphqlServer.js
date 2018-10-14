import { ApolloServer } from 'apollo-server-lambda'
import {
  schema,
  queries,
  mutations,
  resolvers,
} from '../application'

const allResolvers = {
  Query: queries,
  Mutation: mutations,
  ...resolvers,
}

const lambda = new ApolloServer({
  tracing: true,
  context: ({ event, context }) => ({
    headers: event.headers,
    requestId: context.awsRequestId,
    db: context.db,
    transaction: context.db,
    loaders: context.loaders,
  }),
  typeDefs: schema,
  resolvers: allResolvers,
})

export default lambda
