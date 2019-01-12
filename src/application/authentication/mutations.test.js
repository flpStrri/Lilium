import {
  createLoginInputFactory,
  createSignupInputFactory,
  createSignupConfirmInputFactory,
  createResendConfirmationCodeInputFactory,
  createPasswordChangeInputFactory,
  createPasswordForgotInputFactory,
  createPasswordForgotConfirmInputFactory,
  createRefreshSessionInputFactory,
} from 'application/authentication/factory'
import authenticationMutations from 'application/authentication/mutations'

const mockedAuthenticationService = {
  login: jest.fn(),
  signup: jest.fn(),
  signupConfirm: jest.fn(),
  resendConfirmationCode: jest.fn(),
  passwordChange: jest.fn(),
  logout: jest.fn(),
  passwordForgot: jest.fn(),
  passwordForgotConfirm: jest.fn(),
  refreshSession: jest.fn(),
}

jest.mock('service/authentication', () => ({
  build() {
    return mockedAuthenticationService
  },
}))

describe('AuthenticationMutations', () => {
  const _ = undefined

  beforeAll(async () => {})

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  afterAll(async () => {})

  it('should call login from Authentication Service', async () => {
    expect.assertions(2)
    const mockedArgs = createLoginInputFactory()
    const { input } = mockedArgs
    authenticationMutations.login(_, mockedArgs)
    expect(mockedAuthenticationService.login).toBeCalledTimes(1)
    expect(mockedAuthenticationService.login).toBeCalledWith(input.phoneNumber, input.password)
  })

  it('should call signup from Authentication Service', async () => {
    expect.assertions(2)
    const mockedArgs = createSignupInputFactory()
    const { input } = mockedArgs
    authenticationMutations.signup(_, mockedArgs)
    expect(mockedAuthenticationService.signup).toBeCalledTimes(1)
    expect(mockedAuthenticationService.signup).toBeCalledWith(input.phoneNumber, input.password, input.name)
  })

  it('should call signupConfirm from Authentication Service', async () => {
    expect.assertions(2)
    const mockedArgs = createSignupConfirmInputFactory()
    const { input } = mockedArgs
    authenticationMutations.signupConfirm(_, mockedArgs)
    expect(mockedAuthenticationService.signupConfirm).toBeCalledTimes(1)
    expect(mockedAuthenticationService.signupConfirm).toBeCalledWith(input.phoneNumber, input.confirmationCode)
  })

  it('should call resendConfirmationCode from Authentication Service', async () => {
    expect.assertions(2)
    const mockedArgs = createResendConfirmationCodeInputFactory()
    const { input } = mockedArgs
    authenticationMutations.resendConfirmationCode(_, mockedArgs)
    expect(mockedAuthenticationService.resendConfirmationCode).toBeCalledTimes(1)
    expect(mockedAuthenticationService.resendConfirmationCode).toBeCalledWith(input.phoneNumber)
  })

  it('should call passwordChange from Authentication Service', async () => {
    expect.assertions(2)
    const mockedArgs = createPasswordChangeInputFactory()
    const mockedContext = { accessToken: 'fooBar' }
    const { input } = mockedArgs
    authenticationMutations.passwordChange(_, mockedArgs, mockedContext)
    expect(mockedAuthenticationService.passwordChange).toBeCalledTimes(1)
    expect(mockedAuthenticationService.passwordChange).toBeCalledWith(mockedContext.accessToken, input.oldPassword, input.newPassword)
  })

  it('should call logout from Authentication Service', async () => {
    expect.assertions(2)
    const mockedArgs = createSignupConfirmInputFactory()
    const mockedContext = { accessToken: 'fooBar' }
    authenticationMutations.logout(_, mockedArgs, mockedContext)
    expect(mockedAuthenticationService.logout).toBeCalledTimes(1)
    expect(mockedAuthenticationService.logout).toBeCalledWith(mockedContext.accessToken)
  })

  it('should call passwordForgot from Authentication Service', async () => {
    expect.assertions(2)
    const mockedArgs = createPasswordForgotInputFactory()
    const { input } = mockedArgs
    authenticationMutations.passwordForgot(_, mockedArgs)
    expect(mockedAuthenticationService.passwordForgot).toBeCalledTimes(1)
    expect(mockedAuthenticationService.passwordForgot).toBeCalledWith(input.phoneNumber)
  })

  it('should call passwordForgotConfirm from Authentication Service', async () => {
    expect.assertions(2)
    const mockedArgs = createPasswordForgotConfirmInputFactory()
    const { input } = mockedArgs
    authenticationMutations.passwordForgotConfirm(_, mockedArgs)
    expect(mockedAuthenticationService.passwordForgotConfirm).toBeCalledTimes(1)
    expect(mockedAuthenticationService.passwordForgotConfirm).toBeCalledWith(input.phoneNumber, input.newPassword, input.confirmationCode)
  })

  it('should call refreshSession from Authentication Service', async () => {
    expect.assertions(2)
    const mockedArgs = createRefreshSessionInputFactory()
    const { input } = mockedArgs
    authenticationMutations.refreshSession(_, mockedArgs)
    expect(mockedAuthenticationService.refreshSession).toBeCalledTimes(1)
    expect(mockedAuthenticationService.refreshSession).toBeCalledWith(input.refreshToken)
  })
})
