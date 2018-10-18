/**
 * @jest-environment node
 */

import ActLoaders from 'domain/service/act/loaders'
import ActService from 'domain/service/act'
import createMockInstance from 'jest-create-mock-instance'

jest.mock('domain/service/act')

describe('ActLoaders', () => {
  let actService

  beforeEach(async () => {
    actService = createMockInstance(ActService)
    ActService.build.mockReturnValue(actService)
  })

  it('should create ActLoader', async () => {
    const actLoader = ActLoaders.actLoader()
    await actLoader._batchLoadFn(['foo', 'bar'])
    expect(actService.loadByIds).toHaveBeenCalledTimes(1)
    expect(actService.loadByIds).toHaveBeenCalledWith(['foo', 'bar'])
  })

  it('should create MeditationActsLoader', async () => {
    const actLoader = ActLoaders.meditationActsLoader()
    await actLoader._batchLoadFn(['foo', 'bar'])
    expect(actService.loadByMeditationsIds).toHaveBeenCalledTimes(1)
    expect(actService.loadByMeditationsIds).toHaveBeenCalledWith(['foo', 'bar'])
  })
})
