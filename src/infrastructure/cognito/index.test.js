import { CognitoIdentityServiceProvider } from 'aws-sdk'
import createMockInstance from 'jest-create-mock-instance'
import CognitoUserPool from './index'

describe('CognitoUserPool', () => {
  let mockedCognitoIdentityServiceProvider
  let cognitoUserPool
  const mockedUserPoolId = 'userPoolId'
  const mockedClientId = 'clientId'

  beforeAll(async () => {})

  beforeEach(async () => {
    mockedCognitoIdentityServiceProvider = createMockInstance(CognitoIdentityServiceProvider)
    cognitoUserPool = new CognitoUserPool(mockedUserPoolId, mockedClientId, mockedCognitoIdentityServiceProvider)
  })

  afterAll(async () => {})

  describe('build', () => {
    it('should build', () => {
      cognitoUserPool = CognitoUserPool.build(mockedUserPoolId, mockedClientId)
      expect(cognitoUserPool.userPoolId).toEqual(mockedUserPoolId)
      expect(cognitoUserPool.clientId).toEqual(mockedClientId)
      expect(cognitoUserPool.serviceProvider).toBeInstanceOf(CognitoIdentityServiceProvider)
    })
  })


  describe('login', () => {
    it('should resolve promise on login success with accessToken, refreshToken and idToken', async () => {
      expect.assertions(3)
      const testUsername = 'username'
      const testPassword = 'password'
      mockedCognitoIdentityServiceProvider.adminInitiateAuth = jest.fn((params, cb) => {
        cb(null, {
          AuthenticationResult: {
            AccessToken: 'accessToken',
            RefreshToken: 'refreshToken',
            IdToken: 'idToken',
          },
        })
      })
      await expect(cognitoUserPool.login(testUsername, testPassword))
        .resolves
        .toEqual({
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
          idToken: 'idToken',
        })
      expect(mockedCognitoIdentityServiceProvider.adminInitiateAuth).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.adminInitiateAuth).toHaveBeenCalledWith({
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        UserPoolId: mockedUserPoolId,
        ClientId: mockedClientId,
        AuthParameters: {
          USERNAME: testUsername,
          PASSWORD: testPassword,
        },
      }, expect.any(Function))
    })

    it('should reject promise on login failure with an ApolloError object', async () => {
      expect.assertions(3)
      const testUsername = 'username'
      const testPassword = 'password'
      mockedCognitoIdentityServiceProvider.adminInitiateAuth = jest.fn((params, cb) => {
        cb({
          message: 'error message',
          code: 'error code',
        }, null)
      })
      await expect(cognitoUserPool.login(testUsername, testPassword))
        .rejects
        .toEqual(expect.objectContaining({
          message: 'error message',
          extensions: {
            code: 'error code',
          },
        }))
      expect(mockedCognitoIdentityServiceProvider.adminInitiateAuth).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.adminInitiateAuth).toHaveBeenCalledWith({
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        UserPoolId: mockedUserPoolId,
        ClientId: mockedClientId,
        AuthParameters: {
          USERNAME: testUsername,
          PASSWORD: testPassword,
        },
      }, expect.any(Function))
    })
  })

  describe('signup', () => {
    it('should resolve promise on signup success with username if credentials are confirmed', async () => {
      expect.assertions(3)
      const testUsername = 'username'
      const testPassword = 'password'
      mockedCognitoIdentityServiceProvider.signUp = jest.fn((params, cb) => {
        cb(null, {
          UserSub: testUsername,
          userConfirmed: true,
        })
      })
      await expect(cognitoUserPool.signup(testUsername, testPassword, {}))
        .resolves
        .toEqual({
          username: testUsername,
        })
      expect(mockedCognitoIdentityServiceProvider.signUp).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.signUp).toHaveBeenCalledWith({
        Username: testUsername,
        Password: testPassword,
        UserAttributes: {},
        ClientId: mockedClientId,
      }, expect.any(Function))
    })

    it('should resolve promise on signup success with username and next step if credentials are not confirmed', async () => {
      expect.assertions(3)
      const testUsername = 'username'
      const testPassword = 'password'
      mockedCognitoIdentityServiceProvider.signUp = jest.fn((params, cb) => {
        cb(null, {
          UserSub: testUsername,
          userConfirmed: false,
        })
      })
      await expect(cognitoUserPool.signup(testUsername, testPassword, {}))
        .resolves
        .toEqual({
          username: testUsername,
          nextStep: 'CONFIRM_SIGNUP',
        })
      expect(mockedCognitoIdentityServiceProvider.signUp).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.signUp).toHaveBeenCalledWith({
        Username: testUsername,
        Password: testPassword,
        UserAttributes: {},
        ClientId: mockedClientId,
      }, expect.any(Function))
    })

    it('should reject promise on signup failure with an ApolloError object', async () => {
      expect.assertions(3)
      const testUsername = 'username'
      const testPassword = 'password'
      mockedCognitoIdentityServiceProvider.signUp = jest.fn((params, cb) => {
        cb({
          message: 'error message',
          code: 'error code',
        }, null)
      })
      await expect(cognitoUserPool.signup(testUsername, testPassword, {}))
        .rejects
        .toEqual(expect.objectContaining({
          message: 'error message',
          extensions: {
            code: 'error code',
          },
        }))
      expect(mockedCognitoIdentityServiceProvider.signUp).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.signUp).toHaveBeenCalledWith({
        Username: testUsername,
        Password: testPassword,
        UserAttributes: {},
        ClientId: mockedClientId,
      }, expect.any(Function))
    })
  })

  describe('assignUserToGroup', () => {
    it('should resolve promise on assignUserToGroup on assignment success', async () => {
      expect.assertions(3)
      const testUsername = 'username'
      const testGroupName = 'group'

      mockedCognitoIdentityServiceProvider.adminAddUserToGroup = jest.fn((params, cb) => {
        cb(null, {})
      })
      await expect(cognitoUserPool.assignUserToGroup(testUsername, testGroupName))
        .resolves
        .toBeTruthy()
      expect(mockedCognitoIdentityServiceProvider.adminAddUserToGroup).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.adminAddUserToGroup).toHaveBeenCalledWith({
        UserPoolId: mockedUserPoolId,
        Username: testUsername,
        GroupName: testGroupName,
      }, expect.any(Function))
    })

    it('should reject promise on userGroup failure with an ApolloError object', async () => {
      expect.assertions(3)
      const testUsername = 'username'
      const testGroupName = 'group'

      mockedCognitoIdentityServiceProvider.adminAddUserToGroup = jest.fn((params, cb) => {
        cb({
          message: 'error message',
          code: 'error code',
        }, null)
      })
      await expect(cognitoUserPool.assignUserToGroup(testUsername, testGroupName))
        .rejects
        .toEqual(expect.objectContaining({
          message: 'error message',
          extensions: {
            code: 'error code',
          },
        }))
      expect(mockedCognitoIdentityServiceProvider.adminAddUserToGroup).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.adminAddUserToGroup).toHaveBeenCalledWith({
        UserPoolId: mockedUserPoolId,
        Username: testUsername,
        GroupName: testGroupName,
      }, expect.any(Function))
    })
  })

  describe('signupConfirm', () => {
    it('should resolve promise on signup confirm success', async () => {
      expect.assertions(3)
      const testUsername = 'username'
      const testConfirmationCode = 'confirmationCode'
      mockedCognitoIdentityServiceProvider.confirmSignUp = jest.fn((params, cb) => {
        cb(null, {})
      })
      await expect(cognitoUserPool.signupConfirm(testUsername, testConfirmationCode, {}))
        .resolves
        .toBeTruthy()
      expect(mockedCognitoIdentityServiceProvider.confirmSignUp).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.confirmSignUp).toHaveBeenCalledWith({
        Username: testUsername,
        ConfirmationCode: testConfirmationCode,
        ClientId: mockedClientId,
      }, expect.any(Function))
    })

    it('should reject promise on signup confirm failure with an ApolloError object', async () => {
      expect.assertions(3)
      const testUsername = 'username'
      const testConfirmationCode = 'confirmationCode'
      mockedCognitoIdentityServiceProvider.confirmSignUp = jest.fn((params, cb) => {
        cb({
          message: 'error message',
          code: 'error code',
        }, null)
      })
      await expect(cognitoUserPool.signupConfirm(testUsername, testConfirmationCode, {}))
        .rejects
        .toEqual(expect.objectContaining({
          message: 'error message',
          extensions: {
            code: 'error code',
          },
        }))
      expect(mockedCognitoIdentityServiceProvider.confirmSignUp).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.confirmSignUp).toHaveBeenCalledWith({
        Username: testUsername,
        ConfirmationCode: 'confirmationCode',
        ClientId: mockedClientId,
      }, expect.any(Function))
    })
  })

  describe('resendConfirmationCode', () => {
    it('should resolve promise on resendConfirmationCode confirm success', async () => {
      expect.assertions(3)
      const testUsername = 'username'
      mockedCognitoIdentityServiceProvider.resendConfirmationCode = jest.fn((params, cb) => {
        cb(null, {})
      })
      await expect(cognitoUserPool.resendConfirmationCode(testUsername))
        .resolves
        .toBeTruthy()
      expect(mockedCognitoIdentityServiceProvider.resendConfirmationCode).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.resendConfirmationCode).toHaveBeenCalledWith({
        Username: testUsername,
        ClientId: mockedClientId,
      }, expect.any(Function))
    })

    it('should reject promise on resendConfirmationCode failure with an ApolloError object', async () => {
      expect.assertions(3)
      const testUsername = 'username'
      mockedCognitoIdentityServiceProvider.resendConfirmationCode = jest.fn((params, cb) => {
        cb({
          message: 'error message',
          code: 'error code',
        }, null)
      })
      await expect(cognitoUserPool.resendConfirmationCode(testUsername))
        .rejects
        .toEqual(expect.objectContaining({
          message: 'error message',
          extensions: {
            code: 'error code',
          },
        }))
      expect(mockedCognitoIdentityServiceProvider.resendConfirmationCode).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.resendConfirmationCode).toHaveBeenCalledWith({
        Username: testUsername,
        ClientId: mockedClientId,
      }, expect.any(Function))
    })
  })

  describe('logout', () => {
    it('should resolve promise on logout success', async () => {
      expect.assertions(3)
      const testAccessToken = 'accessToken'
      mockedCognitoIdentityServiceProvider.globalSignOut = jest.fn((params, cb) => {
        cb(null, {})
      })
      await expect(cognitoUserPool.logout(testAccessToken))
        .resolves
        .toBeTruthy()
      expect(mockedCognitoIdentityServiceProvider.globalSignOut).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.globalSignOut).toHaveBeenCalledWith({
        AccessToken: testAccessToken,
      }, expect.any(Function))
    })

    it('should reject promise on logout failure with an ApolloError object', async () => {
      expect.assertions(3)
      const testAccessToken = 'accessToken'
      mockedCognitoIdentityServiceProvider.globalSignOut = jest.fn((params, cb) => {
        cb({
          message: 'error message',
          code: 'error code',
        }, null)
      })
      await expect(cognitoUserPool.logout(testAccessToken))
        .rejects
        .toEqual(expect.objectContaining({
          message: 'error message',
          extensions: {
            code: 'error code',
          },
        }))
      expect(mockedCognitoIdentityServiceProvider.globalSignOut).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.globalSignOut).toHaveBeenCalledWith({
        AccessToken: testAccessToken,
      }, expect.any(Function))
    })
  })

  describe('passwordForgot', () => {
    it('should resolve promise on passwordForgot success', async () => {
      expect.assertions(3)
      const testUsername = 'accessToken'
      mockedCognitoIdentityServiceProvider.forgotPassword = jest.fn((params, cb) => {
        cb(null, {})
      })
      await expect(cognitoUserPool.passwordForgot(testUsername))
        .resolves
        .toBeTruthy()
      expect(mockedCognitoIdentityServiceProvider.forgotPassword).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.forgotPassword).toHaveBeenCalledWith({
        ClientId: mockedClientId,
        Username: testUsername,
      }, expect.any(Function))
    })

    it('should reject promise on passwordForgot failure with an ApolloError object', async () => {
      expect.assertions(3)
      const testUsername = 'username'
      mockedCognitoIdentityServiceProvider.forgotPassword = jest.fn((params, cb) => {
        cb({
          message: 'error message',
          code: 'error code',
        }, null)
      })
      await expect(cognitoUserPool.passwordForgot(testUsername))
        .rejects
        .toEqual(expect.objectContaining({
          message: 'error message',
          extensions: {
            code: 'error code',
          },
        }))
      expect(mockedCognitoIdentityServiceProvider.forgotPassword).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.forgotPassword).toHaveBeenCalledWith({
        ClientId: mockedClientId,
        Username: testUsername,
      }, expect.any(Function))
    })
  })

  describe('passwordForgotConfirm', () => {
    it('should resolve promise on passwordForgotConfirm success', async () => {
      expect.assertions(3)
      const testUsername = 'accessToken'
      const testPassword = 'password'
      const testConfirmationCode = 'confirmationCode'
      mockedCognitoIdentityServiceProvider.confirmForgotPassword = jest.fn((params, cb) => {
        cb(null, {})
      })
      await expect(cognitoUserPool.passwordForgotConfirm(testUsername, testPassword, testConfirmationCode))
        .resolves
        .toBeTruthy()
      expect(mockedCognitoIdentityServiceProvider.confirmForgotPassword).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.confirmForgotPassword).toHaveBeenCalledWith({
        ClientId: mockedClientId,
        Username: testUsername,
        Password: testPassword,
        ConfirmationCode: testConfirmationCode,
      }, expect.any(Function))
    })

    it('should reject promise on passwordForgotConfirm failure with an ApolloError object', async () => {
      expect.assertions(3)
      const testUsername = 'username'
      const testPassword = 'password'
      const testConfirmationCode = 'confirmationCode'
      mockedCognitoIdentityServiceProvider.confirmForgotPassword = jest.fn((params, cb) => {
        cb({
          message: 'error message',
          code: 'error code',
        }, null)
      })
      await expect(cognitoUserPool.passwordForgotConfirm(testUsername, testPassword, testConfirmationCode))
        .rejects
        .toEqual(expect.objectContaining({
          message: 'error message',
          extensions: {
            code: 'error code',
          },
        }))
      expect(mockedCognitoIdentityServiceProvider.confirmForgotPassword).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.confirmForgotPassword).toHaveBeenCalledWith({
        ClientId: mockedClientId,
        Username: testUsername,
        Password: testPassword,
        ConfirmationCode: testConfirmationCode,
      }, expect.any(Function))
    })
  })

  describe('passwordChange', () => {
    it('should resolve promise on passwordChange success', async () => {
      expect.assertions(3)
      const testNewPassword = 'newPassword'
      const testOldPassword = 'oldPassword'
      const testAccessToken = 'accessToken'
      mockedCognitoIdentityServiceProvider.changePassword = jest.fn((params, cb) => {
        cb(null, {})
      })
      await expect(cognitoUserPool.passwordChange(testAccessToken, testOldPassword, testNewPassword))
        .resolves
        .toBeTruthy()
      expect(mockedCognitoIdentityServiceProvider.changePassword).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.changePassword).toHaveBeenCalledWith({
        AccessToken: testAccessToken,
        PreviousPassword: testOldPassword,
        ProposedPassword: testNewPassword,
      }, expect.any(Function))
    })

    it('should reject promise on passwordChange failure with an ApolloError object', async () => {
      expect.assertions(3)
      const testNewPassword = 'newPassword'
      const testOldPassword = 'oldPassword'
      const testAccessToken = 'accessToken'
      mockedCognitoIdentityServiceProvider.changePassword = jest.fn((params, cb) => {
        cb({
          message: 'error message',
          code: 'error code',
        }, null)
      })
      await expect(cognitoUserPool.passwordChange(testAccessToken, testOldPassword, testNewPassword))
        .rejects
        .toEqual(expect.objectContaining({
          message: 'error message',
          extensions: {
            code: 'error code',
          },
        }))
      expect(mockedCognitoIdentityServiceProvider.changePassword).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.changePassword).toHaveBeenCalledWith({
        AccessToken: testAccessToken,
        PreviousPassword: testOldPassword,
        ProposedPassword: testNewPassword,
      }, expect.any(Function))
    })
  })

  describe('refreshSession', () => {
    it('should resolve promise on refreshSession success', async () => {
      expect.assertions(3)
      const testRefreshToken = 'refreshToken'
      mockedCognitoIdentityServiceProvider.adminInitiateAuth = jest.fn((params, cb) => {
        cb(null, {
          AuthenticationResult: {
            AccessToken: 'accessToken',
            IdToken: 'idToken',
          },
        })
      })
      await expect(cognitoUserPool.refreshSession(testRefreshToken))
        .resolves
        .toEqual({
          accessToken: 'accessToken',
          refreshToken: testRefreshToken,
          idToken: 'idToken',
        })
      expect(mockedCognitoIdentityServiceProvider.adminInitiateAuth).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.adminInitiateAuth).toHaveBeenCalledWith({
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        UserPoolId: mockedUserPoolId,
        ClientId: mockedClientId,
        AuthParameters: {
          REFRESH_TOKEN: testRefreshToken,
        },
      }, expect.any(Function))
    })

    it('should reject promise on refreshSession failure with an ApolloError object', async () => {
      expect.assertions(3)
      const testRefreshToken = 'refreshToken'
      mockedCognitoIdentityServiceProvider.adminInitiateAuth = jest.fn((params, cb) => {
        cb({
          message: 'error message',
          code: 'error code',
        }, null)
      })
      await expect(cognitoUserPool.refreshSession(testRefreshToken))
        .rejects
        .toEqual(expect.objectContaining({
          message: 'error message',
          extensions: {
            code: 'error code',
          },
        }))
      expect(mockedCognitoIdentityServiceProvider.adminInitiateAuth).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.adminInitiateAuth).toHaveBeenCalledWith({
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        UserPoolId: mockedUserPoolId,
        ClientId: mockedClientId,
        AuthParameters: {
          REFRESH_TOKEN: testRefreshToken,
        },
      }, expect.any(Function))
    })
  })

  describe('userGroup', () => {
    it('should resolve promise on userGroup success with group', async () => {
      expect.assertions(3)
      const testUsername = 'username'
      mockedCognitoIdentityServiceProvider.adminListGroupsForUser = jest.fn((params, cb) => {
        cb(null, {
          Groups: [{
            GroupName: 'groupName',
          }],
        })
      })
      await expect(cognitoUserPool.userGroup(testUsername))
        .resolves
        .toEqual('groupName')
      expect(mockedCognitoIdentityServiceProvider.adminListGroupsForUser).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.adminListGroupsForUser).toHaveBeenCalledWith({
        UserPoolId: mockedUserPoolId,
        Username: testUsername,
        Limit: 1,
      }, expect.any(Function))
    })

    it('should reject promise on userGroup failure with an ApolloError object', async () => {
      expect.assertions(3)
      const testUsername = 'username'
      mockedCognitoIdentityServiceProvider.adminListGroupsForUser = jest.fn((params, cb) => {
        cb({
          message: 'error message',
          code: 'error code',
        }, null)
      })
      await expect(cognitoUserPool.userGroup(testUsername))
        .rejects
        .toEqual(expect.objectContaining({
          message: 'error message',
          extensions: {
            code: 'error code',
          },
        }))
      expect(mockedCognitoIdentityServiceProvider.adminListGroupsForUser).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.adminListGroupsForUser).toHaveBeenCalledWith({
        UserPoolId: mockedUserPoolId,
        Username: testUsername,
        Limit: 1,
      }, expect.any(Function))
    })
  })

  describe('user', () => {
    it('should resolve promise on user success with user attributes', async () => {
      expect.assertions(3)
      const testAccessToken = 'accessToken'
      mockedCognitoIdentityServiceProvider.getUser = jest.fn((params, cb) => {
        cb(null, {
          UserAttributes: [
            { Name: 'attributes-name-one', Value: 'attributesValueOne' },
            { Name: 'attributes-name-two', Value: 'attributesValueTwo' },
          ],
        })
      })
      await expect(cognitoUserPool.user(testAccessToken))
        .resolves
        .toEqual({
          attributesNameOne: 'attributesValueOne',
          attributesNameTwo: 'attributesValueTwo',
        })
      expect(mockedCognitoIdentityServiceProvider.getUser).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.getUser).toHaveBeenCalledWith({
        AccessToken: testAccessToken,
      }, expect.any(Function))
    })

    it('should reject promise on user failure with an ApolloError object', async () => {
      expect.assertions(3)
      const testAccessToken = 'accessToken'
      mockedCognitoIdentityServiceProvider.getUser = jest.fn((params, cb) => {
        cb({
          message: 'error message',
          code: 'error code',
        }, null)
      })
      await expect(cognitoUserPool.user(testAccessToken))
        .rejects
        .toEqual(expect.objectContaining({
          message: 'error message',
          extensions: {
            code: 'error code',
          },
        }))
      expect(mockedCognitoIdentityServiceProvider.getUser).toHaveBeenCalledTimes(1)
      expect(mockedCognitoIdentityServiceProvider.getUser).toHaveBeenCalledWith({
        AccessToken: testAccessToken,
      }, expect.any(Function))
    })
  })
})
