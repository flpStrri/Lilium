import graphqlLambdaServer from 'application/graphqlServer'
import databaseTransactionDecorator from 'application/databaseTransactionDecorator'

export const handle = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false // eslint-disable-line no-param-reassign
  const { awsRequestId } = context
  const graphqlLambdaHandler = graphqlLambdaServer.createHandler()
  const databaseDecoratedHandler = databaseTransactionDecorator(graphqlLambdaHandler)
  databaseDecoratedHandler(event, { awsRequestId }, callback)
}
