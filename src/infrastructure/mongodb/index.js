import { MongoClient } from 'mongodb'
import crypto from 'crypto'

export default async () => {
  const { MONGO_URI, MONGO_DB_NAME } = process.env
  const connection = await MongoClient.connect(MONGO_URI, { useNewUrlParser: true })
  const db = await connection.db(MONGO_DB_NAME)
  db.id = crypto.randomBytes(32).toString('hex')
  return db
}
