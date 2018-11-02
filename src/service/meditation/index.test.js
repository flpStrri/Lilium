/**
 * @jest-environment node
 */

import Meditation from 'model/meditation'
import MeditationRepository from 'infrastructure/meditation/repository'
import ActRepository from 'infrastructure/act/repository'
import createMockInstance from 'jest-create-mock-instance'
import MeditationService from 'service/meditation'
import meditationFactory from 'model/meditation/factory'
import actFactory from 'model/act/factory'
import {
  createMeditationInputFactory,
  meditationsInputFilterFactory,
  updateMeditationInputFactory,
} from 'application/meditation/factory'

describe('MeditationService', () => {
  let meditationRepository
  let actRepository
  let loaders

  beforeAll(async () => {})

  beforeEach(async () => {
    meditationRepository = createMockInstance(MeditationRepository)
    actRepository = createMockInstance(ActRepository)
    loaders = {
      meditationLoader: {
        clear: jest.fn(),
      },
      actLoader: {
        clear: jest.fn(),
      },
      meditationActsLoader: {
        clear: jest.fn(),
      },
    }
  })

  afterAll(async () => {})

  it('should build', async () => {
    const mockedDb = {
      collection: jest.fn(() => 'foo'),
    }
    const meditationService = MeditationService.build(mockedDb, 'baz')
    expect(meditationService.actRepository).toBeInstanceOf(ActRepository)
    expect(meditationService.meditationRepository).toBeInstanceOf(MeditationRepository)
    expect(meditationService.loaders).toEqual('baz')
  })

  it('should create new meditation given a valid createMeditationInput', async () => {
    const input = createMeditationInputFactory()
    const mockMeditation = meditationFactory()
    const mockActs = actFactory(2)
    meditationRepository.add = jest.fn(() => mockMeditation)
    actRepository.addMany = jest.fn(() => mockActs)
    const meditationService = new MeditationService(meditationRepository, actRepository, loaders)

    const addedMeditation = await meditationService.create(input)
    expect(meditationRepository.add).toHaveBeenCalledTimes(1)
    expect(meditationRepository.add).toHaveBeenCalledWith(new Meditation(input))
    expect(actRepository.addMany).toHaveBeenCalledTimes(1)
    expect(loaders.meditationLoader.clear).toHaveBeenCalledTimes(1)
    expect(loaders.actLoader.clear).toHaveBeenCalledTimes(2)
    expect(loaders.meditationActsLoader.clear).toHaveBeenCalledTimes(1)
    expect(addedMeditation).toEqual(expect.objectContaining({
      _id: expect.any(String),
      name: expect.any(String),
      category: expect.any(String),
      shortDescription: expect.any(String),
      acts: expect.any(Array),
    }))
  })

  it('should throw error when creating meditation given a invalid meditation part of createMeditationInput', async () => {
    const meditationService = new MeditationService(meditationRepository, actRepository, loaders)
    const input = createMeditationInputFactory(1, { category: 'foo' })
    await expect(meditationService.create(input))
      .rejects
      .toEqual(expect.objectContaining({
        message: 'Arguments invalid',
        extensions: {
          code: 'BAD_USER_INPUT',
        },
        invalidArgs: ['"category" must be one of [morning, evening, night]'],
      }))
    expect(meditationRepository.add).not.toHaveBeenCalled()
    expect(actRepository.addMany).not.toHaveBeenCalled()
    expect(loaders.meditationLoader.clear).not.toHaveBeenCalled()
    expect(loaders.actLoader.clear).not.toHaveBeenCalled()
    expect(loaders.meditationActsLoader.clear).not.toHaveBeenCalled()
  })

  it('should throw error when creating meditation given a invalid act part of createMeditationInput', async () => {
    const meditationService = new MeditationService(meditationRepository, actRepository, loaders)
    const input = createMeditationInputFactory()
    input.acts[0].textBody = undefined
    await expect(meditationService.create(input))
      .rejects
      .toEqual(expect.objectContaining({
        message: 'Arguments invalid',
        extensions: {
          code: 'BAD_USER_INPUT',
        },
        invalidArgs: ['"textBody" is required'],
      }))
    expect(meditationRepository.add).not.toHaveBeenCalled()
    expect(actRepository.addMany).not.toHaveBeenCalled()
    expect(loaders.meditationLoader.clear).not.toHaveBeenCalled()
    expect(loaders.actLoader.clear).not.toHaveBeenCalled()
    expect(loaders.meditationActsLoader.clear).not.toHaveBeenCalled()
  })

  it('should call loadByFilter correctly when load have been called', async () => {
    const mockMeditations = meditationFactory(2)
    meditationRepository.loadByFilter = jest.fn(() => mockMeditations)
    const meditationService = new MeditationService(meditationRepository, actRepository, loaders)
    const input = meditationsInputFilterFactory()
    const addedMeditation = await meditationService.loadByFilter(input)
    expect(meditationRepository.loadByFilter).toHaveBeenCalledTimes(1)
    expect(meditationRepository.loadByFilter).toHaveBeenCalledWith(input)
    expect(addedMeditation).toEqual(expect.arrayContaining(mockMeditations))
  })

  it('should batchLoadByIds given array of ids', async () => {
    const mockMeditations = meditationFactory(2)
    meditationRepository.loadByIds = jest.fn(() => Promise.resolve(mockMeditations))
    const meditationService = new MeditationService(meditationRepository)
    const orderedMeditations = await meditationService.loadByIds([
      mockMeditations[1]._id,
      mockMeditations[0]._id,
    ])
    expect(orderedMeditations.map(meditation => meditation._id)).toEqual([
      mockMeditations[1]._id,
      mockMeditations[0]._id,
    ])
  })

  it('should update a meditation given a valid updateMeditationInput', async () => {
    const input = updateMeditationInputFactory()
    const { id, ...updatingValues } = input
    const mockMeditation = meditationFactory(1, { id })
    meditationRepository.load = jest.fn(() => mockMeditation)
    meditationRepository.replace = jest.fn(() => mockMeditation)
    const meditationService = new MeditationService(meditationRepository, actRepository, loaders)
    const updatedMeditation = await meditationService.update(input)
    expect(meditationRepository.load).toHaveBeenCalledTimes(1)
    expect(meditationRepository.load).toHaveBeenCalledWith(id)
    expect(meditationRepository.replace).toHaveBeenCalledTimes(1)
    expect(meditationRepository.replace).toHaveBeenCalledWith(expect.objectContaining(updatingValues))
    expect(loaders.meditationLoader.clear).toHaveBeenCalledTimes(1)
    expect(loaders.meditationLoader.clear).toHaveBeenCalledWith(id)
    expect(updatedMeditation).toEqual(expect.objectContaining(updatingValues))
  })

  it('should throw error when updating a meditation given a invalid updateMeditationInput', async () => {
    const input = updateMeditationInputFactory(1, { category: 'foo' })
    const mockMeditation = meditationFactory(1, { id: input.id })
    meditationRepository.load = jest.fn(() => mockMeditation)
    const meditationService = new MeditationService(meditationRepository, actRepository, loaders)
    await expect(meditationService.update(input))
      .rejects
      .toEqual(expect.objectContaining({
        message: 'Arguments invalid',
        extensions: {
          code: 'BAD_USER_INPUT',
        },
        invalidArgs: ['"category" must be one of [morning, evening, night]'],
      }))
    expect(meditationRepository.load).toHaveBeenCalledTimes(1)
    expect(meditationRepository.load).toHaveBeenCalledWith(input.id)
    expect(meditationRepository.replace).not.toHaveBeenCalled()
    expect(loaders.meditationLoader.clear).not.toHaveBeenCalled()
  })

  it('should delete new meditation given a valid id', async () => {
    const mockMeditation = meditationFactory()
    const mockActs = actFactory(2)
    meditationRepository.load = jest.fn(() => mockMeditation)
    actRepository.loadByMeditationsIds = jest.fn(() => mockActs)
    const meditationService = new MeditationService(meditationRepository, actRepository, loaders)
    await meditationService.delete(mockMeditation._id)
    expect(meditationRepository.load).toHaveBeenCalledTimes(1)
    expect(meditationRepository.load).toHaveBeenCalledWith(mockMeditation._id)
    expect(meditationRepository.delete).toHaveBeenCalledTimes(1)
    expect(meditationRepository.delete).toHaveBeenCalledWith(mockMeditation._id)
    expect(actRepository.deleteMany).toHaveBeenCalledTimes(1)
    expect(actRepository.deleteMany).toHaveBeenCalledWith(mockActs.map(act => act._id))
    expect(loaders.meditationLoader.clear).toHaveBeenCalledWith(mockMeditation._id)
    expect(loaders.actLoader.clear).toHaveBeenCalledTimes(2)
    expect(loaders.actLoader.clear).toHaveBeenNthCalledWith(1, mockActs[0]._id)
    expect(loaders.actLoader.clear).toHaveBeenNthCalledWith(2, mockActs[1]._id)
  })

  it('should throw error when deleting meditation when it does not exist', async () => {
    meditationRepository.load = jest.fn(() => undefined)
    const meditationService = new MeditationService(meditationRepository, actRepository, loaders)
    await expect(meditationService.delete('foo'))
      .rejects
      .toEqual(expect.objectContaining({
        message: 'Meditation not found',
        extensions: {
          code: 'NOT_FOUND',
        },
      }))
    expect(meditationRepository.load).toHaveBeenCalledTimes(1)
    expect(meditationRepository.load).toHaveBeenCalledWith('foo')
    expect(meditationRepository.delete).not.toHaveBeenCalled()
    expect(actRepository.deleteMany).not.toHaveBeenCalled()
    expect(loaders.meditationLoader.clear).not.toHaveBeenCalled()
    expect(loaders.meditationActsLoader.clear).not.toHaveBeenCalled()
  })
})
