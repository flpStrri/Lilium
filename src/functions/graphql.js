import graphqlLambdaServer from 'application/graphqlServer'
import connectToMongoDB from 'infrastructure/mongodb'

let db

export const handle = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false // eslint-disable-line no-param-reassign
  if (!db) {
    db = await connectToMongoDB()
  }
  console.log(db.id)
  const { awsRequestId } = context
  const graphqlLambdaHandler = graphqlLambdaServer.createHandler()
  graphqlLambdaHandler(event, { awsRequestId, db }, callback)
}
