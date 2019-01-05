import AuthenticationDirectives from 'application/authentication/directives'

describe('AuthDirective', () => {
  const _ = undefined

  beforeAll(async () => {})

  beforeEach(async () => {})

  afterAll(async () => {})

  it('should get the correct direct declaration', () => {
    expect.assertions(1)

    const directiveName = 'anyName'
    const schema = {
      getType: jest.fn(typeName => typeName),
    }
    const graphQLDirective = AuthenticationDirectives.getDirectiveDeclaration(directiveName, schema)
    expect(graphQLDirective).toEqual(expect.objectContaining({
      name: 'auth',
      args: [{
        astNode: undefined,
        defaultValue: 'user',
        description: null,
        name: 'role',
        type: 'Role',
      }],
      locations: ['FIELD_DEFINITION', 'OBJECT'],
    }))
  })

  describe('visitFieldDefinition', () => {
    it('should resolve visitFieldDefinition when correct roles are provided', async () => {
      const directiveName = 'anyName'
      const expectedRole = 'admin'
      const field = { resolve: { apply: jest.fn((__, args) => args) } }
      const args = { role: expectedRole }

      const authDirective = new AuthenticationDirectives({ name: directiveName })
      authDirective.args = args
      authDirective.visitFieldDefinition(field)
      await expect(field.resolve(_, _, { user: { role: 'admin' } }))
        .resolves
        .toBeTruthy()
    })
    it('should throw unauthorized error on visitFieldDefinition when wrong roles are provided', async () => {
      const directiveName = 'anyName'
      const expectedRole = 'admin'
      const field = {}
      const args = { role: expectedRole }

      const authDirective = new AuthenticationDirectives({ name: directiveName })
      authDirective.args = args
      authDirective.visitFieldDefinition(field)
      await expect(field.resolve(_, _, { user: { role: `not-${expectedRole}` } }))
        .rejects
        .toEqual(expect.objectContaining({
          message: 'You are not authorized to perform this action',
          extensions: { code: 'UNAUTHENTICATED' },
        }))
    })

    it('should throw unauthorized error on visitFieldDefinition when no user is provided', async () => {
      const directiveName = 'anyName'
      const expectedRole = 'admin'
      const field = {}
      const args = { role: expectedRole }

      const authDirective = new AuthenticationDirectives({ name: directiveName })
      authDirective.args = args
      authDirective.visitFieldDefinition(field)
      await expect(field.resolve(_, _, {}))
        .rejects
        .toEqual(expect.objectContaining({ extensions: { code: 'UNAUTHENTICATED' } }))
    })
  })

  describe('visitObject', () => {
    it('should resolve visitObject when correct roles are provided', async () => {
      const directiveName = 'anyName'
      const expectedRole = 'admin'
      const field = { resolve: { apply: jest.fn((__, args) => args) } }
      const obj = { getFields: jest.fn(() => ({ field })) }
      const args = { role: expectedRole }

      const authDirective = new AuthenticationDirectives({ name: directiveName })
      authDirective.args = args
      authDirective.visitObject(obj)
      await expect(field.resolve(_, _, { user: { role: 'admin' } }))
        .resolves
        .toBeTruthy()
    })
    it('should throw unauthorized error on visitFieldDefinition when wrong roles are provided', async () => {
      const directiveName = 'anyName'
      const expectedRole = 'admin'
      const field = {}
      const obj = { getFields: jest.fn(() => ({ field })) }
      const args = { role: expectedRole }

      const authDirective = new AuthenticationDirectives({ name: directiveName })
      authDirective.args = args
      authDirective.visitObject(obj)
      await expect(field.resolve(_, _, { user: { role: `not-${expectedRole}` } }))
        .rejects
        .toEqual(expect.objectContaining({
          message: 'You are not authorized to perform this action',
          extensions: { code: 'UNAUTHENTICATED' },
        }))
    })

    it('should throw unauthorized error on visitFieldDefinition when no user is provided', async () => {
      const directiveName = 'anyName'
      const expectedRole = 'admin'
      const field = {}
      const obj = { getFields: jest.fn(() => ({ field })) }
      const args = { role: expectedRole }

      const authDirective = new AuthenticationDirectives({ name: directiveName })
      authDirective.args = args
      authDirective.visitObject(obj)
      await expect(field.resolve(_, _, {}))
        .rejects
        .toEqual(expect.objectContaining({ extensions: { code: 'UNAUTHENTICATED' } }))
    })
  })
})
