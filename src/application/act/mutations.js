import ActService from 'service/act'

export default {
  createAct: (_, args, context) => {
    const actService = ActService.build(context.db, context.loaders)
    return actService.create(args.input)
  },
  deleteAct: (_, args, context) => {
    const actService = ActService.build(context.db, context.loaders)
    return actService.delete(args.id)
  },
  updateAct: (_, args, context) => {
    const actService = ActService.build(context.db, context.loaders)
    return actService.update(args.input)
  },
}
