import { MongoClient } from 'mongodb'
import MeditationRepository from 'infrastructure/meditation/repository'
import Meditation from 'model/meditation'
import meditationFactory from 'model/meditation/factory'

describe('MeditationRepository', () => {
  let connection
  let db
  let meditationCollection

  beforeAll(async () => {
    connection = await MongoClient.connect(global.MONGO_URI, { useNewUrlParser: true })
    db = await connection.db(global.MONGO_DB_NAME)
    meditationCollection = db.collection(Meditation.name.toLowerCase())
  })

  beforeEach(async () => {
    await meditationCollection.removeMany()
  })

  afterAll(async () => {
    await connection.close()
    await db.close()
  })

  it('should add a Meditation domain object to the meditation collection', async () => {
    const mockMeditation = meditationFactory()
    const meditationRepository = new MeditationRepository(db)

    await meditationRepository.add(mockMeditation)

    const insertedMeditation = await meditationCollection.findOne({ _id: mockMeditation._id })
    expect(insertedMeditation).toEqual(mockMeditation.toJSON())
    const meditationCollectionDocs = await meditationCollection.find().toArray()
    expect(meditationCollectionDocs.length).toEqual(1)
  })

  it('should throw error when a _id colision happen while adding an Meditation domain object to the meditation collection', async () => {
    const mockMeditation = meditationFactory()
    await meditationCollection.insertOne(mockMeditation.toJSON())
    const meditationRepository = new MeditationRepository(db)
    await expect(meditationRepository.add(mockMeditation))
      .rejects
      .toThrow(`E11000 duplicate key error dup key: { : "${mockMeditation._id}" }`)
  })

  it('should load domain object given id', async () => {
    const mockMeditation = meditationFactory()
    await meditationCollection.insertOne(mockMeditation.toJSON())
    const meditationRepository = new MeditationRepository(db)
    const loadedMeditation = await meditationRepository.load(mockMeditation._id)
    expect(loadedMeditation).toMatchObject(mockMeditation)
  })

  it('should raise GraphQL when loading domain object given an id not into the database', async () => {
    const meditationRepository = new MeditationRepository(db)
    await expect(meditationRepository.load('foo'))
      .rejects
      .toEqual(expect.objectContaining({
        message: 'Meditation not found',
        extensions: {
          code: 'NOT_FOUND',
        },
      }))
  })

  it('should prommise load domain object given ids', async () => {
    const mockMeditations = meditationFactory(4)
    const meditationRepository = new MeditationRepository(db)
    await meditationCollection.insertMany(mockMeditations.map(mockMeditation => mockMeditation.toJSON()))
    const loadedMeditations = await meditationRepository.loadByIds(mockMeditations.map(mockAct => mockAct._id))
    expect(loadedMeditations)
      .toEqual(expect.arrayContaining(mockMeditations.map(mockMeditation => mockMeditation.toJSON())))
    expect(loadedMeditations.map(loadedMeditation => loadedMeditation._id))
      .toEqual(expect.arrayContaining(mockMeditations.map(mockMeditation => mockMeditation._id)))
  })

  it('should load domain objects given filter input', async () => {
    const mockMeditations = meditationFactory(3, { category: 'evening' })
    mockMeditations[0].name = 'Meditation with AwesomeNametestQueryEnd'
    mockMeditations[2].category = 'morning'
    await meditationCollection.insertMany(mockMeditations.map(meditation => meditation.toJSON()))
    const meditationRepository = new MeditationRepository(db)
    const loadedMeditations = await meditationRepository.loadByFilter({ category: 'evening', search: 'testQuery' })
    expect(loadedMeditations.length).toBe(1)
    expect(loadedMeditations[0].toJSON()).toEqual(mockMeditations[0].toJSON())
  })

  it('should return empty array when loading domain objects given a filter input that gets no docs', async () => {
    const mockMeditations = meditationFactory(3, { category: 'evening' })
    await meditationCollection.insertMany(mockMeditations.map(meditation => meditation.toJSON()))
    const meditationRepository = new MeditationRepository(db)
    const loadedMeditations = await meditationRepository.loadByFilter({ category: 'morning' })
    expect(loadedMeditations.length).toBe(0)
  })

  it('should load domain objects given a mongo injection input', async () => {
    const injectionQuery = '(function(){var date = new Date(); do{curDate = new Date();}while(curDate-date<10000); return Math.max();})()'
    const mockMeditation = meditationFactory()
    await meditationCollection.insertOne(mockMeditation.toJSON())
    const meditationRepository = new MeditationRepository(db)
    const loadedMeditations = await meditationRepository.loadByFilter({ search: injectionQuery })
    expect(loadedMeditations.length).toBe(0)
  })

  it('should replace a doc from the meditation collection when given an updatable domain object', async () => {
    const mockMeditation = meditationFactory()
    const mockMeditationToUpdate = meditationFactory(1, { id: mockMeditation._id })
    await meditationCollection.insertOne(mockMeditation.toJSON())
    const meditationRepository = new MeditationRepository(db)
    const replacedMeditation = await meditationRepository.replace(mockMeditationToUpdate)
    expect(replacedMeditation).toMatchObject(mockMeditationToUpdate)
  })

  it('should raise a Graphql error when replacing a document from the meditation collection given a domain object not into the database', async () => {
    const mockMeditation = meditationFactory()
    const meditationRepository = new MeditationRepository(db)
    await expect(meditationRepository.replace(mockMeditation))
      .rejects
      .toEqual(expect.objectContaining({
        message: 'Meditation not found',
        extensions: {
          code: 'NOT_FOUND',
        },
      }))
  })

  it('should delete one document given id', async () => {
    const mockMeditation = meditationFactory()
    await meditationCollection.insertOne(mockMeditation.toJSON())
    const meditationRepository = new MeditationRepository(db)
    await meditationRepository.delete(mockMeditation._id)
  })

  it('should raise a Graphql error when deleteing a document from the meditation collection given an id not into the database one document given id', async () => {
    const meditationRepository = new MeditationRepository(db)
    await expect(meditationRepository.delete('bar'))
      .rejects
      .toEqual(expect.objectContaining({
        message: 'Meditation not found',
        extensions: {
          code: 'NOT_FOUND',
        },
      }))
  })

  it('should batch load by meditation ids', async () => {
    const mockMeditations = meditationFactory(4)
    const meditationRepository = new MeditationRepository(db)
    await meditationCollection.insertMany(mockMeditations.map(mockMeditation => mockMeditation.toJSON()))
    const loadedMeditations = await meditationRepository.loadByIds(mockMeditations.map(mockMeditation => mockMeditation._id))
    expect(loadedMeditations).toEqual(expect.arrayContaining(mockMeditations.map(mockMeditation => mockMeditation.toJSON())))
    expect(loadedMeditations.map(loadedMeditation => loadedMeditation._id))
      .toEqual(expect.arrayContaining(mockMeditations.map(mockMeditation => mockMeditation._id)))
  })
})
