/**
 * @jest-environment node
 */

import MeditationLoaders from 'domain/service/meditation/loaders'
import MeditationRepository from 'domain/model/meditation/repository'
import createMockInstance from 'jest-create-mock-instance'

describe('MeditationLoaders', () => {
  let meditationRepository

  beforeEach(async () => {
    meditationRepository = createMockInstance(MeditationRepository)
  })

  it('shoudl create MeditationLoader', async () => {
    const meditationLoader = MeditationLoaders.createMeditationLoader(meditationRepository)
    await meditationLoader._batchLoadFn(['foo', 'bar'])
    expect(meditationRepository.batchLoadByIds).toHaveBeenCalledTimes(1)
    expect(meditationRepository.batchLoadByIds).toHaveBeenCalledWith(['foo', 'bar'])
  })
})
