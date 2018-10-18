/**
 * @jest-environment node
 */

import MeditationLoaders from 'domain/service/meditation/loaders'
import MeditationService from 'domain/service/meditation'
import createMockInstance from 'jest-create-mock-instance'

jest.mock('domain/service/meditation')

describe('MeditationLoaders', () => {
  let meditationService

  beforeEach(async () => {
    meditationService = createMockInstance(MeditationService)
    MeditationService.build.mockReturnValue(meditationService)
  })

  it('shoudl create MeditationLoader', async () => {
    const meditationLoader = MeditationLoaders.meditationLoader()
    await meditationLoader._batchLoadFn(['foo', 'bar'])
    expect(meditationService.loadByIds).toHaveBeenCalledTimes(1)
    expect(meditationService.loadByIds).toHaveBeenCalledWith(['foo', 'bar'])
  })
})
