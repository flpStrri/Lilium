import { ApolloServer } from 'apollo-server-lambda'
import {
  schema,
  queries,
  mutations,
  createLoaders,
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
    loaders: createLoaders(context.db),
  }),
  typeDefs: schema,
  resolvers: allResolvers,
})

export default lambda
