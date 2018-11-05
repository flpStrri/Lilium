import AuthenticationService from 'service/authentication'

export default {
  login: (_, { input }) => {
    const { phoneNumber, password } = input
    const authenticationService = AuthenticationService.build()
    return authenticationService.login(phoneNumber, password)
  },

  signup: (_, { input }) => {
    const { phoneNumber, password, name } = input
    const authenticationService = AuthenticationService.build()
    return authenticationService.signup(phoneNumber, password, name)
  },

  signupConfirm: (_, { input }) => {
    const { phoneNumber, confirmationCode } = input
    const authenticationService = AuthenticationService.build()
    return authenticationService.signupConfirm(phoneNumber, confirmationCode)
  },

  resendConfirmationCode: (_, { input }) => {
    const { phoneNumber } = input
    const authenticationService = AuthenticationService.build()
    return authenticationService.resendConfirmationCode(phoneNumber)
  },

  passwordChange: (_, { input }, { accessToken }) => {
    const { oldPassword, newPassword } = input
    const authenticationService = AuthenticationService.build()
    return authenticationService.passwordChange(accessToken, oldPassword, newPassword)
  },

  logout: (_, __, { accessToken }) => {
    const authenticationService = AuthenticationService.build()
    return authenticationService.logout(accessToken)
  },

  passwordForgot: (_, { input }) => {
    const { phoneNumber } = input
    const authenticationService = AuthenticationService.build()
    return authenticationService.passwordForgot(phoneNumber)
  },

  passwordForgotConfirm: (_, { input }) => {
    const { phoneNumber, newPassword, confirmationCode } = input
    const authenticationService = AuthenticationService.build()
    return authenticationService.passwordForgotConfirm(phoneNumber, newPassword, confirmationCode)
  },

  refreshSession: (_, { input }) => {
    const { refreshToken } = input
    const authenticationService = AuthenticationService.build()
    return authenticationService.refreshSession(refreshToken)
  },
}
