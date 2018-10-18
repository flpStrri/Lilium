import { MongoClient } from 'mongodb'
import {
  createMeditationInputFactory,
  updateMeditationInputFactory,
} from 'domain/application/meditation/factory'
import Act from 'domain/model/act'
import actFactory from 'domain/model/act/factory'
import Meditation from 'domain/model/meditation'
import meditationFactory from 'domain/model/meditation/factory'
import { createLoaders } from 'application'
import meditationMutations from 'domain/application/meditation/mutations'

describe('MeditationMutations', () => {
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

  it('should create an Meditation domain object', async () => {
    const mockCreateMeditationInput = createMeditationInputFactory()
    const insertedMeditation = await meditationMutations.createMeditation(_, { input: mockCreateMeditationInput }, { db, loaders })
    const meditationCollectionDocs = await meditationCollection.find().toArray()
    expect(meditationCollectionDocs.length).toEqual(1)
    const { acts: insertedMeditationActs, ...insertedMeditationInfo } = insertedMeditation
    const { acts: mockCreateMeditationInputActs, ...mockCreateMeditationInputInfo } = mockCreateMeditationInput
    expect(insertedMeditationInfo)
      .toEqual(expect.objectContaining(mockCreateMeditationInputInfo))
    expect(insertedMeditationActs[0])
      .toEqual(expect.objectContaining(mockCreateMeditationInputActs[0]))
  })

  it('should update an Meditation domain object', async () => {
    const mockMeditation = meditationFactory()
    const mockUpdateMeditationInput = updateMeditationInputFactory(1, mockMeditation._id)
    await meditationCollection.insertOne(mockMeditation.toJSON())
    const updatedMeditation = await meditationMutations.updateMeditation(_, { input: mockUpdateMeditationInput }, { db, loaders })
    expect({ ...mockUpdateMeditationInput, meditationId: updatedMeditation.meditationId, _id: mockUpdateMeditationInput.id })
      .toEqual(expect.objectContaining(updatedMeditation))
  })

  it('should delete one Meditation domain object given id', async () => {
    const mockMeditation = meditationFactory()
    const mockActs = actFactory(2, _, _, _, mockMeditation._id)
    await actCollection.insertMany(mockActs.map(mockAct => mockAct.toJSON()))
    await meditationCollection.insertOne(mockMeditation.toJSON())
    await meditationMutations.deleteMeditation(_, { id: mockMeditation._id }, { db, loaders })
    const meditationCollectionDocs = await meditationCollection.find().toArray()
    const actCollectionDocs = await actCollection.find().toArray()
    expect(meditationCollectionDocs.length).toEqual(0)
    expect(actCollectionDocs.length).toEqual(0)
  })
})
