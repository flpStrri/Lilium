import graphqlLambdaServer from 'application/graphqlServer'
import connectToMongoDB from 'infrastructure/mongodb'
import { ACCESS_TOKEN_BEARER } from 'regex'

let db

export const handle = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false // eslint-disable-line no-param-reassign
  const accessToken = event.headers.Authorization ? event.headers.Authorization.replace(ACCESS_TOKEN_BEARER, '') : undefined

  if (!db) {
    db = await connectToMongoDB()
  }
  console.log(db.id)

  const graphqlLambdaHandler = graphqlLambdaServer.createHandler()
  graphqlLambdaHandler(event, { db, accessToken }, callback)
}
