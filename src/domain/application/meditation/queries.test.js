import { MongoClient } from 'mongodb'
import Act from 'domain/model/act'
import actFactory from 'domain/model/act/factory'
import Meditation from 'domain/model/meditation'
import meditationFactory from 'domain/model/meditation/factory'
import { createLoaders } from 'application'
import meditationQueries from 'domain/application/meditation/queries'

describe('MeditationQueries', () => {
  let connection
  let db
  let loaders
  let meditationCollection
  let actCollection
  const _ = undefined

  beforeAll(async () => {
    connection = await MongoClient.connect(global.MONGO_URI, { useNewUrlParser: true })
    db = await connection.db(global.MONGO_DB_NAME)
    loaders = createLoaders(db)
    meditationCollection = db.collection(Meditation.name.toLowerCase())
    actCollection = db.collection(Act.name.toLowerCase())
  })

  beforeEach(async () => {
    await meditationCollection.removeMany()
    await actCollection.removeMany()
  })

  afterAll(async () => {
    await connection.close()
    await db.close()
  })

  it('should delete one Meditation domain object given id', async () => {
    const mockMeditation = meditationFactory()
    const mockActs = actFactory(2, _, _, _, mockMeditation._id)
    await actCollection.insertMany(mockActs.map(mockAct => mockAct.toJSON()))
    await meditationCollection.insertOne(mockMeditation.toJSON())
    const queriedMeditations = await meditationQueries.meditations(_, { input: { category: mockMeditation.category } }, { db, loaders })
    expect(queriedMeditations.length).toEqual(1)
    expect(queriedMeditations[0]).toEqual(expect.objectContaining(mockMeditation.toJSON()))
  })
})
