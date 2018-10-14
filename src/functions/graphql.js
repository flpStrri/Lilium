import graphqlLambdaServer from 'application/graphqlServer'
import databaseTransactionDecorator from 'application/databaseTransactionDecorator'
import dataLoadersDecorator from 'application/dataLoadersDecorator'

export const handle = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false // eslint-disable-line no-param-reassign
  const { awsRequestId } = context
  const dataLoadersDecoratedHandler = dataLoadersDecorator(graphqlLambdaServer.createHandler())
  const databaseDecoratedHandler = databaseTransactionDecorator(dataLoadersDecoratedHandler)
  databaseDecoratedHandler(event, { awsRequestId }, callback)
}
