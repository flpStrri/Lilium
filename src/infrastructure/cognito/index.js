import { CognitoIdentityServiceProvider } from 'aws-sdk'
import { ApolloError } from 'apollo-server'
import { toCamelCase } from 'infrastructure/cognito/utils'
import { path } from 'ramda'

export default class CognitoUserPool {
  constructor(userPoolId, clientId, serviceProvider) {
    this.serviceProvider = serviceProvider
    this.userPoolId = userPoolId
    this.clientId = clientId
  }

  static build(userPoolId, clientId) {
    const serviceProvider = new CognitoIdentityServiceProvider({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    })

    return new CognitoUserPool(userPoolId, clientId, serviceProvider)
  }

  login(username, password) {
    const params = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      UserPoolId: this.userPoolId,
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    }
    return new Promise((resolve, reject) => {
      this.serviceProvider.adminInitiateAuth(params, (err, data) => {
        if (err) {
          reject(new ApolloError(err.message, err.code))
        } else {
          const { AccessToken, RefreshToken, IdToken } = data.AuthenticationResult
          resolve({
            accessToken: AccessToken,
            refreshToken: RefreshToken,
            idToken: IdToken,
          })
        }
      })
    })
  }

  signup(username, password, attributes) {
    const params = {
      ClientId: this.clientId,
      Username: username,
      Password: password,
      UserAttributes: attributes,
    }
    return new Promise((resolve, reject) => {
      this.serviceProvider.signUp(params, (err, res) => {
        if (err) {
          reject(new ApolloError(err.message, err.code))
        } else if (res.userConfirmed) {
          resolve({
            username: res.UserSub,
          })
        } else {
          resolve({
            username: res.UserSub,
            nextStep: 'CONFIRM_SIGNUP',
          })
        }
      })
    })
  }

  signupConfirm(username, confirmationCode) {
    const params = {
      ConfirmationCode: confirmationCode,
      Username: username,
      ClientId: this.clientId,
    }
    return new Promise((resolve, reject) => {
      this.serviceProvider.confirmSignUp(params, (err, res) => {
        if (err) {
          reject(new ApolloError(err.message, err.code))
        } else {
          resolve(res)
        }
      })
    })
  }

  resendConfirmationCode(username) {
    const params = {
      Username: username,
      ClientId: this.clientId,
    }
    return new Promise((resolve, reject) => {
      this.serviceProvider.resendConfirmationCode(params, (err, res) => {
        if (err) {
          reject(new ApolloError(err.message, err.code))
        } else {
          resolve(res)
        }
      })
    })
  }

  user(accessToken) {
    const params = {
      AccessToken: accessToken,
    }
    return new Promise((resolve, reject) => {
      this.serviceProvider.getUser(params, (err, res) => {
        if (err) {
          reject(new ApolloError(err.message, err.code))
        } else {
          resolve(res.UserAttributes.reduce((accumulator, currentValue) => ({
            ...accumulator,
            [toCamelCase(currentValue.Name)]: currentValue.Value,
          }), {}))
        }
      })
    })
  }

  userGroup(username) {
    const params = {
      UserPoolId: this.userPoolId,
      Username: username,
      Limit: 1,
    }
    return new Promise((resolve, reject) => {
      this.serviceProvider.adminListGroupsForUser(params, (err, res) => {
        if (err) {
          reject(new ApolloError(err.message, err.code))
        } else {
          resolve(path(['Groups', 0, 'GroupName'], res))
        }
      })
    })
  }

  logout(accessToken) {
    const params = {
      AccessToken: accessToken,
    }
    return new Promise((resolve, reject) => {
      this.serviceProvider.globalSignOut(params, (err, res) => {
        if (err) {
          reject(new ApolloError(err.message, err.code))
        } else {
          resolve(res)
        }
      })
    })
  }

  passwordForgot(username) {
    const params = {
      ClientId: this.clientId,
      Username: username,
    }
    return new Promise((resolve, reject) => {
      this.serviceProvider.forgotPassword(params, (err, res) => {
        if (err) {
          reject(new ApolloError(err.message, err.code))
        } else {
          resolve(res)
        }
      })
    })
  }

  passwordForgotConfirm(username, newPassword, confirmationCode) {
    const params = {
      ClientId: this.clientId,
      Username: username,
      Password: newPassword,
      ConfirmationCode: confirmationCode,
    }
    return new Promise((resolve, reject) => {
      this.serviceProvider.confirmForgotPassword(params, (err, res) => {
        if (err) {
          reject(new ApolloError(err.message, err.code))
        } else {
          resolve(res)
        }
      })
    })
  }

  passwordChange(accessToken, oldPassword, newPassword) {
    const params = {
      AccessToken: accessToken,
      PreviousPassword: oldPassword,
      ProposedPassword: newPassword,
    }
    return new Promise((resolve, reject) => {
      this.serviceProvider.changePassword(params, (err, res) => {
        if (err) {
          reject(new ApolloError(err.message, err.code))
        } else {
          resolve(res)
        }
      })
    })
  }

  refreshSession(refreshToken) {
    const params = {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      UserPoolId: this.userPoolId,
      ClientId: this.clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    }
    return new Promise((resolve, reject) => {
      this.serviceProvider.adminInitiateAuth(params, (err, res) => {
        if (err) {
          reject(new ApolloError(err.message, err.code))
        } else {
          const { AccessToken, IdToken } = res.AuthenticationResult
          resolve({
            accessToken: AccessToken,
            refreshToken,
            idToken: IdToken,
          })
        }
      })
    })
  }
}
