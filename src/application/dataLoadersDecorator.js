import dataLoaders from 'application/loaders'
import MeditationRepository from 'domain/model/meditation/repository'
import ActRepository from 'domain/model/act/repository'

export default handler => async (event, context, callback) => {
  const loaders = {
    actLoader: dataLoaders.createActLoader(new ActRepository(context.db)),
    meditationActsLoader: dataLoaders.createMeditationActsLoader(new ActRepository(context.db)),
    meditationLoader: dataLoaders.createMeditationLoader(new MeditationRepository(context.db)),
  }
  return handler(event, { ...context, loaders }, callback)
}
