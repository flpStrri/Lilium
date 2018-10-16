import connectToMongoDB from 'infrastructure/mongodb'

describe('MongoDB', () => {
  beforeAll(async () => {
    process.env.MONGO_URI = global.MONGO_URI
    process.env.MONGO_DB_NAME = global.MONGO_DB_NAME
  })

  it('connect to mongo', async () => {
    const db = await connectToMongoDB()
    expect(db.serverConfig.isConnected()).toBeTruthy()
  })
})
