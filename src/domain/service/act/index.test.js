/**
 * @jest-environment node
 */

import Act from 'domain/model/act'
import ActRepository from 'domain/model/act/repository'
import createMockInstance from 'jest-create-mock-instance'
import ActService from 'domain/service/act'
import actFactory from 'domain/model/act/factory'
import {
  createActInputFactory,
  updateActInputFactory,
} from 'domain/application/act/factory'

describe('ActService', () => {
  let actRepository
  let loaders
  const _ = undefined

  beforeAll(async () => {})

  beforeEach(async () => {
    actRepository = createMockInstance(ActRepository)
    loaders = {
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
      collection: jest.fn(() => 'foo')
    }
    const actService = ActService.build(mockedDb, 'baz')
    expect(actService.actRepository).toBeInstanceOf(ActRepository)
    expect(actService.loaders).toEqual('baz')
  })

  it('should create new act given a valid createActInput', async () => {
    const input = createActInputFactory()
    const mockAct = actFactory()
    actRepository.add = jest.fn(() => mockAct)
    const actService = new ActService(actRepository, loaders)
    await actService.create(input)
    expect(actRepository.add).toHaveBeenCalledTimes(1)
    expect(actRepository.add).toHaveBeenCalledWith(new Act(input))
    expect(loaders.actLoader.clear).toHaveBeenCalledTimes(1)
  })

  it('should throw error when creating act given a invalid createActInput', async () => {
    const actService = new ActService(actRepository, loaders)
    const input = createActInputFactory(1, _, _, _, -1)
    await expect(actService.create(input))
      .rejects
      .toEqual(expect.objectContaining({
        message: 'Arguments invalid',
        extensions: {
          code: 'BAD_USER_INPUT',
        },
        invalidArgs: ['"index" must be a positive number'],
      }))
    expect(actRepository.add).not.toHaveBeenCalled()
    expect(loaders.actLoader.clear).not.toHaveBeenCalled()
  })

  it('should update a act given a valid updateActInput', async () => {
    const input = updateActInputFactory()
    const { id, ...updatingValues } = input
    const mockAct = actFactory(1, id)
    actRepository.load = jest.fn(() => mockAct)
    actRepository.replace = jest.fn(() => mockAct)
    const actService = new ActService(actRepository, loaders)
    const updatedAct = await actService.update(input)
    expect(actRepository.load).toHaveBeenCalledTimes(1)
    expect(actRepository.load).toHaveBeenCalledWith(id)
    expect(actRepository.replace).toHaveBeenCalledTimes(1)
    expect(actRepository.replace).toHaveBeenCalledWith(expect.objectContaining(updatingValues))
    expect(loaders.actLoader.clear).toHaveBeenCalledTimes(1)
    expect(loaders.actLoader.clear).toHaveBeenCalledWith(id)
    expect(updatedAct).toEqual(mockAct.toJSON())
  })

  it('should throw error when updating a act given a invalid updateActInput', async () => {
    const input = updateActInputFactory(1, _, _, _, -1)
    const mockAct = actFactory(1, input.id)
    actRepository.load = jest.fn(() => mockAct)
    const actService = new ActService(actRepository, loaders)
    await expect(actService.update(input))
      .rejects
      .toEqual(expect.objectContaining({
        message: 'Arguments invalid',
        extensions: {
          code: 'BAD_USER_INPUT',
        },
        invalidArgs: ['"index" must be a positive number'],
      }))
    expect(actRepository.load).toHaveBeenCalledTimes(1)
    expect(actRepository.load).toHaveBeenCalledWith(input.id)
    expect(actRepository.replace).not.toHaveBeenCalled()
    expect(loaders.actLoader.clear).not.toHaveBeenCalled()
  })

  it('should delete new act given a valid id', async () => {
    const mockActs = actFactory(2)
    actRepository.load = jest.fn(() => mockActs[0])
    actRepository.loadByMeditationId = jest.fn(() => mockActs)
    const actService = new ActService(actRepository, loaders)
    await actService.delete(mockActs[0]._id)
    expect(actRepository.load).toHaveBeenCalledTimes(1)
    expect(actRepository.load).toHaveBeenCalledWith(mockActs[0]._id)
    expect(actRepository.loadByMeditationId).toHaveBeenCalledTimes(1)
    expect(actRepository.loadByMeditationId).toHaveBeenCalledWith([mockActs[0].meditationId])
    expect(actRepository.delete).toHaveBeenCalledTimes(1)
    expect(actRepository.delete).toHaveBeenCalledWith(mockActs[0]._id)
    expect(loaders.actLoader.clear).toHaveBeenCalledTimes(1)
    expect(loaders.actLoader.clear).toHaveBeenCalledWith(mockActs[0]._id)
    expect(loaders.meditationActsLoader.clear).toHaveBeenCalledTimes(1)
    expect(loaders.meditationActsLoader.clear).toHaveBeenCalledWith(mockActs[0].meditationId)
  })

  it('should throw error when deleting act when it is the only child', async () => {
    const mockAct = actFactory()
    actRepository.load = jest.fn(() => mockAct)
    actRepository.loadByMeditationId = jest.fn(() => [1])
    const actService = new ActService(actRepository, loaders)
    await expect(actService.delete(mockAct._id))
      .rejects
      .toEqual(expect.objectContaining({
        message: 'Meditation must have at least one Act',
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      }))
    expect(actRepository.load).toHaveBeenCalledTimes(1)
    expect(actRepository.load).toHaveBeenCalledWith(mockAct._id)
    expect(actRepository.loadByMeditationId).toHaveBeenCalledTimes(1)
    expect(actRepository.loadByMeditationId).toHaveBeenCalledWith([mockAct.meditationId])
    expect(actRepository.delete).not.toHaveBeenCalled()
    expect(loaders.actLoader.clear).not.toHaveBeenCalled()
    expect(loaders.meditationActsLoader.clear).not.toHaveBeenCalled()
  })

  it('should throw error when deleting act when it does not exist', async () => {
    actRepository.load = jest.fn(() => undefined)
    const actService = new ActService(actRepository, loaders)
    await expect(actService.delete('foo'))
      .rejects
      .toEqual(expect.objectContaining({
        message: 'Act not found',
        extensions: {
          code: 'NOT_FOUND',
        },
      }))
    expect(actRepository.load).toHaveBeenCalledTimes(1)
    expect(actRepository.load).toHaveBeenCalledWith('foo')
    expect(actRepository.delete).not.toHaveBeenCalled()
    expect(loaders.actLoader.clear).not.toHaveBeenCalled()
    expect(loaders.meditationActsLoader.clear).not.toHaveBeenCalled()
  })
})
