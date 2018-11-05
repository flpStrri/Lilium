import { ApolloServer } from 'apollo-server-lambda'
import AuthenticationService from 'service/authentication'
import {
  schema,
  queries,
  mutations,
  directives,
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
  context: async ({ context }) => {
    const authenticationService = AuthenticationService.build()
    return {
      accessToken: context.accessToken,
      user: context.accessToken
        ? await authenticationService.profile(context.accessToken)
        : undefined,
      db: context.db,
      loaders: createLoaders(context.db),
    }
  },
  typeDefs: schema,
  resolvers: allResolvers,
  schemaDirectives: directives,
})

export default lambda
