import { gql } from 'apollo-server'

export default gql`

enum Role {
  reader
  user
  admin
}

type Authentication {
  username: ID
  nextStep: String
  refreshToken: String
  accessToken: String
  accessTokenExpiresAt: String
  idToken: String
  idTokenExpiresAt: String
}

input AuthenticationInput {
  username: ID
  accessToken: String!
  idToken: String!
}

input LoginInput {
  phoneNumber: String!
  password: String!
}

input SignupInput {
  phoneNumber: String!
  password: String!
  name: String!
}

input PasswordChangeInput {
  oldPassword: String!
  newPassword: String!
}

input SignupConfirmInput {
  phoneNumber: String!
  confirmationCode: String!
}

input ResendConfirmationCodeInput {
  phoneNumber: String!
}

input PasswordForgotInput {
  phoneNumber: String!
}

input PasswordForgotConfirmInput {
  phoneNumber: String!
  confirmationCode: String!
  newPassword: String!
}

input RefreshSessionInput {
  refreshToken: String!
}

type Mutation {
  login(input: LoginInput!): Authentication
  signup(input: SignupInput!): Authentication
  signupConfirm(input: SignupConfirmInput!): Boolean
  resendConfirmationCode(input: ResendConfirmationCodeInput!): Boolean
  passwordChange(input: PasswordChangeInput!): Boolean @auth(role:admin)
  passwordForgot(input: PasswordForgotInput!): Boolean
  passwordForgotConfirm(input: PasswordForgotConfirmInput!): Boolean
  refreshSession(input:RefreshSessionInput!): Authentication
  logout: Boolean
}
`
