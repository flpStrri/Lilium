import { MongoClient } from 'mongodb'
import Act from 'domain/model/act'
import actFactory from 'domain/model/act/factory'
import Meditation from 'domain/model/meditation'
import meditationFactory from 'domain/model/meditation/factory'
import { createLoaders } from 'application'
import meditationResolvers from 'domain/application/meditation/resolvers'

describe('MeditationResolvers', () => {
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

  it('should return an Meditation domain object id', () => {
    const mockMeditation = meditationFactory()
    const resolvedMeditationId = meditationResolvers.id(mockMeditation)
    expect(resolvedMeditationId).toEqual(mockMeditation._id)
  })

  it('should return and array of Act objects given one Meditation domain object', async () => {
    const mockMeditation = meditationFactory()
    const mockActs = actFactory(2, _, _, _, mockMeditation._id)
    await actCollection.insertMany(mockActs.map(mockAct => mockAct.toJSON()))
    await meditationCollection.insertOne(mockMeditation.toJSON())
    const loadedActs = await meditationResolvers.acts(mockMeditation, _, { db, loaders })
    expect(loadedActs)
      .toEqual(expect.arrayContaining(mockActs.map(mockAct => mockAct.toJSON())))
  })
})
