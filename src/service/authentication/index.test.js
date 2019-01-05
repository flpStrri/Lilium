/**
 * @jest-environment node
 */

import createMockInstance from 'jest-create-mock-instance'
import { ApolloError } from 'apollo-server'
import CognitoUserPool from 'infrastructure/cognito'
import AuthenticationService from 'service/authentication'

describe('AuthenticationService', () => {
  let cognitoUserPool
  let authenticationService

  beforeEach(async () => {
    cognitoUserPool = createMockInstance(CognitoUserPool)
    authenticationService = new AuthenticationService(cognitoUserPool)
  })

  it('should build', async () => {
    authenticationService = AuthenticationService.build()
    expect(authenticationService).toBeInstanceOf(AuthenticationService)
    expect(authenticationService.userPool).toBeInstanceOf(CognitoUserPool)
  })

  it('should login calling cognitoUserPool.login and returning its result', async () => {
    expect.assertions(6)
    const testPhoneNumber = '+5599999999999'
    const testPassword = 'password'

    cognitoUserPool.login = jest.fn(() => Promise.resolve(true))
    const loginResolve = authenticationService.login(testPhoneNumber, testPassword)
    await expect(loginResolve).resolves.toBe(true)
    expect(cognitoUserPool.login).toBeCalledTimes(1)
    expect(cognitoUserPool.login).toBeCalledWith(testPhoneNumber, testPassword)

    cognitoUserPool.login = jest.fn(() => Promise.reject(new Error('errorMessage')))
    const loginReject = authenticationService.login(testPhoneNumber, testPassword)
    await expect(loginReject).rejects.toThrowError('errorMessage')
    expect(cognitoUserPool.login).toBeCalledTimes(1)
    expect(cognitoUserPool.login).toBeCalledWith(testPhoneNumber, testPassword)
  })

  it('should signupConfirm calling cognitoUserPool.signupConfirm and returning its result', async () => {
    expect.assertions(6)
    const testPhoneNumber = '+5599999999999'
    const testConfirmationCode = 'confirmationCode'

    cognitoUserPool.signupConfirm = jest.fn(() => Promise.resolve(true))
    const signupConfirmResolve = authenticationService.signupConfirm(testPhoneNumber, testConfirmationCode)
    await expect(signupConfirmResolve).resolves.toBe(true)
    expect(cognitoUserPool.signupConfirm).toBeCalledTimes(1)
    expect(cognitoUserPool.signupConfirm).toBeCalledWith(testPhoneNumber, testConfirmationCode)

    cognitoUserPool.signupConfirm = jest.fn(() => Promise.reject(new Error('errorMessage')))
    const signupConfirmReject = authenticationService.signupConfirm(testPhoneNumber, testConfirmationCode)
    await expect(signupConfirmReject).rejects.toThrowError('errorMessage')
    expect(cognitoUserPool.signupConfirm).toBeCalledTimes(1)
    expect(cognitoUserPool.signupConfirm).toBeCalledWith(testPhoneNumber, testConfirmationCode)
  })

  it('should resendConfirmationCode calling cognitoUserPool.resendConfirmationCode and returning its result', async () => {
    expect.assertions(6)
    const testPhoneNumber = '+5599999999999'

    cognitoUserPool.resendConfirmationCode = jest.fn(() => Promise.resolve(true))
    const resendConfirmationCodeResolve = authenticationService.resendConfirmationCode(testPhoneNumber)
    await expect(resendConfirmationCodeResolve).resolves.toBe(true)
    expect(cognitoUserPool.resendConfirmationCode).toBeCalledTimes(1)
    expect(cognitoUserPool.resendConfirmationCode).toBeCalledWith(testPhoneNumber)

    cognitoUserPool.resendConfirmationCode = jest.fn(() => Promise.reject(new Error('errorMessage')))
    const resendConfirmationCodeReject = authenticationService.resendConfirmationCode(testPhoneNumber)
    await expect(resendConfirmationCodeReject).rejects.toThrowError('errorMessage')
    expect(cognitoUserPool.resendConfirmationCode).toBeCalledTimes(1)
    expect(cognitoUserPool.resendConfirmationCode).toBeCalledWith(testPhoneNumber)
  })

  it('should passwordForgot calling cognitoUserPool.passwordForgot and returning its result', async () => {
    expect.assertions(6)
    const testPhoneNumber = '+5599999999999'

    cognitoUserPool.passwordForgot = jest.fn(() => Promise.resolve(true))
    const passwordForgotResolve = authenticationService.passwordForgot(testPhoneNumber)
    await expect(passwordForgotResolve).resolves.toBe(true)
    expect(cognitoUserPool.passwordForgot).toBeCalledTimes(1)
    expect(cognitoUserPool.passwordForgot).toBeCalledWith(testPhoneNumber)

    cognitoUserPool.passwordForgot = jest.fn(() => Promise.reject(new Error('errorMessage')))
    const passwordForgotReject = authenticationService.passwordForgot(testPhoneNumber)
    await expect(passwordForgotReject).rejects.toThrowError('errorMessage')
    expect(cognitoUserPool.passwordForgot).toBeCalledTimes(1)
    expect(cognitoUserPool.passwordForgot).toBeCalledWith(testPhoneNumber)
  })

  it('should refreshSession calling cognitoUserPool.refreshSession and returning its result', async () => {
    expect.assertions(6)
    const testRefreshToken = 'abcd'

    cognitoUserPool.refreshSession = jest.fn(() => Promise.resolve(true))
    const refreshSessionResolve = authenticationService.refreshSession(testRefreshToken)
    await expect(refreshSessionResolve).resolves.toBe(true)
    expect(cognitoUserPool.refreshSession).toBeCalledTimes(1)
    expect(cognitoUserPool.refreshSession).toBeCalledWith(testRefreshToken)

    cognitoUserPool.refreshSession = jest.fn(() => Promise.reject(new Error('errorMessage')))
    const refreshSessionReject = authenticationService.refreshSession(testRefreshToken)
    await expect(refreshSessionReject).rejects.toThrowError('errorMessage')
    expect(cognitoUserPool.refreshSession).toBeCalledTimes(1)
    expect(cognitoUserPool.refreshSession).toBeCalledWith(testRefreshToken)
  })

  it('should logout calling cognitoUserPool.logout and returning its result', async () => {
    expect.assertions(6)
    const testAccessToken = 'abcd'

    cognitoUserPool.logout = jest.fn(() => Promise.resolve(true))
    const logoutResolve = authenticationService.logout(testAccessToken)
    await expect(logoutResolve).resolves.toBe(true)
    expect(cognitoUserPool.logout).toBeCalledTimes(1)
    expect(cognitoUserPool.logout).toBeCalledWith(testAccessToken)

    cognitoUserPool.logout = jest.fn(() => Promise.reject(new Error('errorMessage')))
    const logoutReject = authenticationService.logout(testAccessToken)
    await expect(logoutReject).rejects.toThrowError('errorMessage')
    expect(cognitoUserPool.logout).toBeCalledTimes(1)
    expect(cognitoUserPool.logout).toBeCalledWith(testAccessToken)
  })

  it('should passwordForgotConfirm calling cognitoUserPool.passwordForgotConfirm and returning its result', async () => {
    expect.assertions(6)
    const testPhoneNumber = '+5599999999999'
    const testNewPassword = 'newPassword'
    const testConfirmationCode = 'abcd'

    cognitoUserPool.passwordForgotConfirm = jest.fn(() => Promise.resolve(true))
    const passwordForgotConfirmResolve = authenticationService.passwordForgotConfirm(testPhoneNumber, testNewPassword, testConfirmationCode)
    await expect(passwordForgotConfirmResolve).resolves.toBe(true)
    expect(cognitoUserPool.passwordForgotConfirm).toBeCalledTimes(1)
    expect(cognitoUserPool.passwordForgotConfirm).toBeCalledWith(testPhoneNumber, testNewPassword, testConfirmationCode)

    cognitoUserPool.passwordForgotConfirm = jest.fn(() => Promise.reject(new Error('errorMessage')))
    const passwordForgotConfirmReject = authenticationService.passwordForgotConfirm(testPhoneNumber, testNewPassword, testConfirmationCode)
    await expect(passwordForgotConfirmReject).rejects.toThrowError('errorMessage')
    expect(cognitoUserPool.passwordForgotConfirm).toBeCalledTimes(1)
    expect(cognitoUserPool.passwordForgotConfirm).toBeCalledWith(testPhoneNumber, testNewPassword, testConfirmationCode)
  })

  it('should passwordChange calling cognitoUserPool.passwordChange and returning its result', async () => {
    expect.assertions(6)
    const testAccessToken = 'abcd'
    const testOldPassword = 'oldPassword'
    const testNewPassword = 'newPassword'

    cognitoUserPool.passwordChange = jest.fn(() => Promise.resolve(true))
    const passwordChangeResolve = authenticationService.passwordChange(testAccessToken, testOldPassword, testNewPassword)
    await expect(passwordChangeResolve).resolves.toBe(true)
    expect(cognitoUserPool.passwordChange).toBeCalledTimes(1)
    expect(cognitoUserPool.passwordChange).toBeCalledWith(testAccessToken, testOldPassword, testNewPassword)

    cognitoUserPool.passwordChange = jest.fn(() => Promise.reject(new Error('errorMessage')))
    const passwordChangeReject = authenticationService.passwordChange(testAccessToken, testOldPassword, testNewPassword)
    await expect(passwordChangeReject).rejects.toThrowError('errorMessage')
    expect(cognitoUserPool.passwordChange).toBeCalledTimes(1)
    expect(cognitoUserPool.passwordChange).toBeCalledWith(testAccessToken, testOldPassword, testNewPassword)
  })

  it('should load profile on success', async () => {
    expect.assertions(5)
    const testAccessToken = 'abcd'
    const testUserName = 'testUsername'
    const testUserGroup = 'testRole'

    cognitoUserPool.user = jest.fn(() => Promise.resolve({ sub: testUserName }))
    cognitoUserPool.userGroup = jest.fn(() => Promise.resolve(testUserGroup))
    const profileResolve = authenticationService.profile(testAccessToken)
    await expect(profileResolve).resolves.toEqual({
      sub: testUserName,
      role: testUserGroup,
    })
    expect(cognitoUserPool.user).toBeCalledTimes(1)
    expect(cognitoUserPool.user).toBeCalledWith(testAccessToken)
    expect(cognitoUserPool.userGroup).toBeCalledTimes(1)
    expect(cognitoUserPool.userGroup).toBeCalledWith(testUserName)
  })

  it('should throw ApolloError when loading profile on cognitoUserPool user function rejects', async () => {
    expect.assertions(4)
    const testAccessToken = 'abcd'
    const testUserGroup = 'testRole'

    cognitoUserPool.user = jest.fn(() => Promise.reject(new ApolloError('errorMessage', 'errorCode')))
    cognitoUserPool.userGroup = jest.fn(() => Promise.resolve(testUserGroup))
    const profileRejectFirst = authenticationService.profile(testAccessToken)
    await expect(profileRejectFirst).rejects.toEqual(expect.objectContaining({
      message: 'errorMessage',
      extensions: {
        code: 'errorCode',
      },
    }))
    expect(cognitoUserPool.user).toBeCalledTimes(1)
    expect(cognitoUserPool.user).toBeCalledWith(testAccessToken)
    expect(cognitoUserPool.userGroup).toBeCalledTimes(0)
  })

  it('should throw ApolloError when loading profile on cognitoUserPool userGroup function rejects', async () => {
    expect.assertions(5)
    const testAccessToken = 'abcd'
    const testUserName = 'testUsername'

    cognitoUserPool.user = jest.fn(() => Promise.resolve({ sub: testUserName }))
    cognitoUserPool.userGroup = jest.fn(() => Promise.reject(new ApolloError('errorMessage', 'errorCode')))
    const profileRejectSecond = authenticationService.profile(testAccessToken)
    await expect(profileRejectSecond).rejects.toEqual(expect.objectContaining({
      message: 'errorMessage',
      extensions: {
        code: 'errorCode',
      },
    }))
    expect(cognitoUserPool.user).toBeCalledTimes(1)
    expect(cognitoUserPool.user).toBeCalledWith(testAccessToken)
    expect(cognitoUserPool.userGroup).toBeCalledTimes(1)
    expect(cognitoUserPool.userGroup).toBeCalledWith(testUserName)
  })

  it('should signup calling cognitoUserPool.signup and cognitoUserPool.assignUserToGroup returning its result', async () => {
    expect.assertions(5)
    const testPhoneNumber = '+5599999999999'
    const testUsername = '16eca798-725a-4db3-931a-444d8f4f617c'
    const testPassword = 'abcd123'
    const testName = 'foo'

    cognitoUserPool.signup = jest.fn(() => Promise.resolve({ username: testUsername }))
    cognitoUserPool.assignUserToGroup = jest.fn(() => Promise.resolve({}))
    const signupResolve = authenticationService.signup(testPhoneNumber, testPassword, testName)
    await expect(signupResolve).resolves.toEqual({ username: testUsername })
    expect(cognitoUserPool.signup).toBeCalledTimes(1)
    expect(cognitoUserPool.signup).toBeCalledWith(
      testPhoneNumber,
      testPassword,
      [
        { Name: 'name', Value: testName },
        { Name: 'phone_number', Value: testPhoneNumber },
      ],
    )
    expect(cognitoUserPool.assignUserToGroup).toBeCalledTimes(1)
    expect(cognitoUserPool.assignUserToGroup).toBeCalledWith(testUsername, 'user')
  })

  it('should throw ApolloError signing up when cognitoUserPool.signup function rejects', async () => {
    expect.assertions(4)
    const testPhoneNumber = '+5599999999999'
    const testPassword = 'abcd123'
    const testName = 'foo'


    cognitoUserPool.signup = jest.fn(() => Promise.reject(new ApolloError('errorMessage', 'errorCode')))
    cognitoUserPool.assignUserToGroup = jest.fn(() => Promise.resolve({}))
    const signupReject = authenticationService.signup(testPhoneNumber, testPassword, testName)
    await expect(signupReject).rejects.toEqual(expect.objectContaining({
      message: 'errorMessage',
      extensions: {
        code: 'errorCode',
      },
    }))
    expect(cognitoUserPool.signup).toBeCalledTimes(1)
    expect(cognitoUserPool.signup).toBeCalledWith(
      testPhoneNumber,
      testPassword,
      [
        { Name: 'name', Value: testName },
        { Name: 'phone_number', Value: testPhoneNumber },
      ],
    )
    expect(cognitoUserPool.assignUserToGroup).toBeCalledTimes(0)
  })

  it('should throw ApolloError signing up when cognitoUserPool.assignUserToGroup function rejects', async () => {
    expect.assertions(5)
    const testPhoneNumber = '+5599999999999'
    const testUsername = '16eca798-725a-4db3-931a-444d8f4f617c'
    const testPassword = 'abcd123'
    const testName = 'foo'

    cognitoUserPool.signup = jest.fn(() => Promise.resolve({ username: testUsername }))
    cognitoUserPool.assignUserToGroup = jest.fn(() => Promise.reject(new ApolloError('errorMessage', 'errorCode')))
    const signupReject = authenticationService.signup(testPhoneNumber, testPassword, testName)
    await expect(signupReject).rejects.toEqual(expect.objectContaining({
      message: 'errorMessage',
      extensions: {
        code: 'errorCode',
      },
    }))
    expect(cognitoUserPool.signup).toBeCalledTimes(1)
    expect(cognitoUserPool.signup).toBeCalledWith(
      testPhoneNumber,
      testPassword,
      [
        { Name: 'name', Value: testName },
        { Name: 'phone_number', Value: testPhoneNumber },
      ],
    )
    expect(cognitoUserPool.assignUserToGroup).toBeCalledTimes(1)
    expect(cognitoUserPool.assignUserToGroup).toBeCalledWith(testUsername, 'user')
  })
})
