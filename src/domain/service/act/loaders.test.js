/**
 * @jest-environment node
 */

import ActLoaders from 'domain/service/act/loaders'
import ActRepository from 'domain/model/act/repository'
import createMockInstance from 'jest-create-mock-instance'

describe('ActLoaders', () => {
  let actRepository

  beforeEach(async () => {
    actRepository = createMockInstance(ActRepository)
  })

  it('should create ActLoader', async () => {
    const actLoader = ActLoaders.createActLoader(actRepository)
    await actLoader._batchLoadFn(['foo', 'bar'])
    expect(actRepository.batchLoadByIds).toHaveBeenCalledTimes(1)
    expect(actRepository.batchLoadByIds).toHaveBeenCalledWith(['foo', 'bar'])
  })

  it('should create MeditationActsLoader', async () => {
    const actLoader = ActLoaders.createMeditationActsLoader(actRepository)
    await actLoader._batchLoadFn(['foo', 'bar'])
    expect(actRepository.batchLoadByMeditationsIds).toHaveBeenCalledTimes(1)
    expect(actRepository.batchLoadByMeditationsIds).toHaveBeenCalledWith(['foo', 'bar'])
  })
})
