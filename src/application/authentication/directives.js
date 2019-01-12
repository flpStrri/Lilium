import { AuthenticationError } from 'apollo-server'
import { SchemaDirectiveVisitor, defaultFieldResolver } from 'graphql-tools'
import { DirectiveLocation, GraphQLDirective } from 'graphql'

export default class AuthDirective extends SchemaDirectiveVisitor {
  static getDirectiveDeclaration(directiveName, schema) {
    return new GraphQLDirective({
      name: 'auth',
      locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.OBJECT],
      args: {
        role: {
          type: schema.getType('Role'),
          defaultValue: 'user',
        },
      },
    })
  }

  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    const expectedRole = this.args.role

    field.resolve = async (...args) => {
      const context = args[2]
      if (!context || !context.user) {
        throw new AuthenticationError()
      }
      const { user } = context
      if (expectedRole === user.role) {
        return resolve.apply(this, args)
      }
      throw new AuthenticationError('You are not authorized to perform this action')
    }
  }

  visitObject(obj) {
    const fields = obj.getFields()
    const expectedRole = this.args.role

    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName]
      const { resolve = defaultFieldResolver } = field
      field.resolve = async (...args) => {
        const context = args[2]
        if (!context || !context.user) {
          throw new AuthenticationError()
        }
        const { user } = context
        if (expectedRole === user.role) {
          return resolve.apply(this, args)
        }
        throw new AuthenticationError('You are not authorized to perform this action')
      }
    })
  }
}
