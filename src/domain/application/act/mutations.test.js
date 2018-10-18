import { MongoClient } from 'mongodb'
import {
  createActInputFactory,
  updateActInputFactory,
} from 'domain/application/act/factory'
import Act from 'domain/model/act'
import actFactory from 'domain/model/act/factory'
import { createLoaders } from 'application'
import ActMutations from 'domain/application/act/mutations'

describe('ActMutations', () => {
  let connection
  let db
  let loaders
  let actCollection
  const _ = undefined

  beforeAll(async () => {
    connection = await MongoClient.connect(global.MONGO_URI, { useNewUrlParser: true })
    db = await connection.db(global.MONGO_DB_NAME)
    loaders = createLoaders(db)
    actCollection = db.collection(Act.name.toLowerCase())
  })

  beforeEach(async () => {
    await actCollection.removeMany()
  })

  afterAll(async () => {
    await connection.close()
    await db.close()
  })

  it('should create an Act domain object', async () => {
    const mockCreateActInput = createActInputFactory()
    const insertedAct = await ActMutations.createAct(_, { input: mockCreateActInput }, { db, loaders })
    expect(insertedAct).toEqual(mockCreateActInput)
    const actCollectionDocs = await actCollection.find().toArray()
    expect(actCollectionDocs.length).toEqual(1)
    expect(actCollectionDocs[0]).toEqual(insertedAct)
  })

  it('should update an Act domain object', async () => {
    const mockAct = actFactory()
    const mockUpdateActInput = updateActInputFactory(1, mockAct._id)
    await actCollection.insertOne(mockAct.toJSON())
    const updatedAct = await ActMutations.updateAct(_, { input: mockUpdateActInput }, { db, loaders })
    expect({ ...mockUpdateActInput, meditationId: updatedAct.meditationId, _id: mockUpdateActInput.id })
      .toEqual(expect.objectContaining(updatedAct))
  })

  it('should delete one Act domain object given id', async () => {
    const mockActs = actFactory(2, _, _, _, 'foo')
    await actCollection.insertMany(mockActs.map(mockAct => mockAct.toJSON()))
    await ActMutations.deleteAct(_, { id: mockActs[0]._id }, { db, loaders })
    const actCollectionDocs = await actCollection.find().toArray()
    expect(actCollectionDocs.length).toEqual(1)
  })
})
