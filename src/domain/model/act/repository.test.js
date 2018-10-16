import { MongoClient } from 'mongodb'
import ActRepository from 'domain/model/act/repository'
import Act from 'domain/model/act'
import actFactory from 'domain/model/act/factory'

describe('ActRepository', () => {
  let connection
  let db
  let actCollection
  const _ = undefined

  beforeAll(async () => {
    connection = await MongoClient.connect(global.MONGO_URI, { useNewUrlParser: true })
    db = await connection.db(global.MONGO_DB_NAME)
    actCollection = db.collection(Act.name.toLowerCase())
  })

  beforeEach(async () => {
    await actCollection.removeMany()
  })

  afterAll(async () => {
    await connection.close()
    await db.close()
  })

  it('should add an Act domain object to the act collection', async () => {
    const mockAct = actFactory()
    const actRepository = new ActRepository(db)
    const insertedAct = await actRepository.add(mockAct)
    expect(insertedAct.toJSON()).toEqual(mockAct.toJSON())
    const actCollectionDocs = await actCollection.find().toArray()
    expect(actCollectionDocs.length).toEqual(1)
  })

  it('should throw error when a _id colision happen while adding an Act domain object to the act collection', async () => {
    const mockAct = actFactory()
    await actCollection.insertOne(mockAct.toJSON())
    const actRepository = new ActRepository(db)
    await expect(actRepository.add(mockAct))
      .rejects
      .toThrow(`E11000 duplicate key error dup key: { : "${mockAct._id}" }`)
  })

  it('should add many Act domain objects to the act collection', async () => {
    const mockActs = actFactory(3)
    const actRepository = new ActRepository(db)
    const insertedActs = await actRepository.addMany(mockActs)
    expect(insertedActs.map(insertedAct => insertedAct.toJSON())).toEqual(mockActs.map(mockAct => mockAct.toJSON()))
    const actCollectionDocs = await actCollection.find().toArray()
    expect(actCollectionDocs.length).toEqual(3)
  })

  it('should load Act domain object given id', async () => {
    const mockAct = actFactory()
    await actCollection.insertOne(mockAct.toJSON())
    const actRepository = new ActRepository(db)
    const loadedAct = await actRepository.load(mockAct._id)
    expect(loadedAct.toJSON()).toMatchObject(mockAct.toJSON())
  })

  it('should raise GraphQL when loading domain object given an id not into the database', async () => {
    const actRepository = new ActRepository(db)
    await expect(actRepository.load('foo'))
      .rejects
      .toEqual(expect.objectContaining({
        message: 'Act not found',
        extensions: {
          code: 'NOT_FOUND',
        },
      }))
  })

  it('should load Act domain objects given meditation id', async () => {
    const mockActs = actFactory(2, _, _, _, 'abcd')
    mockActs[1].meditationId = 'efgh'
    await actCollection.insertMany(mockActs.map(act => act.toJSON()))
    const actRepository = new ActRepository(db)
    const loadedActs = await actRepository.loadByMeditationId(['abcd'])
    expect(loadedActs.length).toBe(1)
    expect(loadedActs[0].toJSON()).toEqual(mockActs[0].toJSON())
  })

  it('should return empty array when loading domain objects given a meditation id input that gets no docs', async () => {
    const mockActs = actFactory(3, _, _, 'abcd')
    await actCollection.insertMany(mockActs.map(act => act.toJSON()))
    const actRepository = new ActRepository(db)
    const loadedActs = await actRepository.loadByMeditationId(['efgh'])
    expect(loadedActs.length).toBe(0)
  })

  it('should replace a doc from the act collection when given an updatable domain object', async () => {
    const mockAct = actFactory()
    const mockActToUpdate = actFactory(1, mockAct._id)
    await actCollection.insertOne(mockAct.toJSON())
    const actRepository = new ActRepository(db)
    const replacedAct = await actRepository.replace(mockActToUpdate)
    expect(replacedAct).toMatchObject(mockActToUpdate)
  })

  it('should raise a Graphql error when replacing a document from the act collection given a domain object not into the database', async () => {
    const mockAct = actFactory()
    const actRepository = new ActRepository(db)
    await expect(actRepository.replace(mockAct))
      .rejects
      .toEqual(expect.objectContaining({
        message: 'Act not found',
        extensions: {
          code: 'NOT_FOUND',
        },
      }))
  })

  it('should delete one document given id', async () => {
    const mockActs = actFactory(2)
    await actCollection.insertMany(mockActs.map(act => act.toJSON()))
    const actRepository = new ActRepository(db)
    await actRepository.delete(mockActs[0]._id)
  })

  it('should delete many documents given id array', async () => {
    const mockActs = actFactory(2)
    await actCollection.insertMany(mockActs.map(act => act.toJSON()))
    const actRepository = new ActRepository(db)
    await actRepository.deleteMany(mockActs.map(mockAct => mockAct._id))
  })

  it('should raise a Graphql error when deleteing many documents from the act collection given no id not into the collection', async () => {
    const mockActs = actFactory(2)
    const actRepository = new ActRepository(db)
    await expect(actRepository.deleteMany(mockActs.map(mockAct => mockAct._id)))
      .rejects
      .toEqual(expect.objectContaining({
        message: 'Acts not found',
        extensions: {
          code: 'NOT_FOUND',
        },
      }))
  })

  it('should raise a Graphql error when deleteing a document from the act collection given an id not into the collection', async () => {
    const mockAct = actFactory()
    const actRepository = new ActRepository(db)
    await expect(actRepository.delete(mockAct._id))
      .rejects
      .toEqual(expect.objectContaining({
        message: 'Act not found',
        extensions: {
          code: 'NOT_FOUND',
        },
      }))
  })

  it('should loadByIds', async () => {
    const mockActs = actFactory(4)
    const actRepository = new ActRepository(db)
    await actCollection.insertMany(mockActs.map(mockAct => mockAct.toJSON()))
    const loadedActs = await actRepository.loadByIds(mockActs.map(mockAct => mockAct._id))
    expect(loadedActs).toEqual(expect.arrayContaining(mockActs.map(mockAct => mockAct.toJSON())))
    expect(loadedActs.map(loadedAct => loadedAct._id)).toEqual(expect.arrayContaining(mockActs.map(mockAct => mockAct._id)))
  })

  it('should batchLoadByMeditationsIds', async () => {
    const mockActs = actFactory(4, _, _, _, 'foo')
    mockActs[3].meditationId = 'bar'
    const actRepository = new ActRepository(db)
    await actCollection.insertMany(mockActs.map(mockAct => mockAct.toJSON()))
    const loadedActs = await actRepository.batchLoadByMeditationsIds(['bar', 'foo'])
    expect(loadedActs).toEqual(expect.arrayContaining(
      [mockActs[3].toJSON()],
      mockActs.slice(0, 3).map(mockAct => mockAct.toJSON()),
    ))
  })

  it('should return empty array when batchLoadByMeditationsIds with a id not into the collection', async () => {
    const mockActs = actFactory(4, _, _, _, 'foo')
    const actRepository = new ActRepository(db)
    await actCollection.insertMany(mockActs.map(mockAct => mockAct.toJSON()))
    const loadedActs = await actRepository.batchLoadByMeditationsIds(['bar'])
    expect(loadedActs).toEqual([])
  })
})
