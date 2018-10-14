import { MongoClient } from 'mongodb'

export default handler => async (event, context, callback) => {
  const connection = await MongoClient.connect('mongodb://my_user:password123@localhost:27017/my_database', { useNewUrlParser: true })
  const db = await connection.db('my_database')
  const transactionCallback = (error, success) => {
    if (success) {
      if (success.body.match(/"errors":\[.+\]/)) {
        console.log('rollback transaction')
        callback(undefined, success)
      } else {
        callback(undefined, success)
      }
    } else {
      throw Error(error)
    }
  }
  const graphqlResult = handler(event, { ...context, db }, transactionCallback)
  return graphqlResult
}
