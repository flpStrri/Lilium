import casual from 'casual'
import factoryFactory from 'factoryFactory'

const createLoginInput = ({
  phoneNumber, password,
}) => ({
  input: {
    phoneNumber: phoneNumber || casual.phone,
    password: password || casual.password,
  },
})
export const createLoginInputFactory = factoryFactory(createLoginInput)

const createSignupInput = ({
  phoneNumber, password, name,
}) => ({
  input: {
    phoneNumber: phoneNumber || casual.phone,
    password: password || casual.password,
    name: name || casual.first_name,
  },
})
export const createSignupInputFactory = factoryFactory(createSignupInput)

const createPasswordChangeInput = ({
  oldPassword, newPassword,
}) => ({
  input: {
    oldPassword: oldPassword || casual.password,
    newPassword: newPassword || casual.password,
  },
})
export const createPasswordChangeInputFactory = factoryFactory(createPasswordChangeInput)

const createSignupConfirmInput = ({
  phoneNumber, confirmationCode,
}) => ({
  input: {
    phoneNumber: phoneNumber || casual.phone,
    confirmationCode: confirmationCode || casual.word,
  },
})
export const createSignupConfirmInputFactory = factoryFactory(createSignupConfirmInput)

const createResendConfirmationCodeInput = ({
  phoneNumber,
}) => ({
  input: {
    phoneNumber: phoneNumber || casual.phone,
  },
})
export const createResendConfirmationCodeInputFactory = factoryFactory(createResendConfirmationCodeInput)

const createPasswordForgotInput = ({
  phoneNumber,
}) => ({
  input: {
    phoneNumber: phoneNumber || casual.phone,
  },
})
export const createPasswordForgotInputFactory = factoryFactory(createPasswordForgotInput)

const createPasswordForgotConfirmInput = ({
  phoneNumber, confirmationCode, newPassword,
}) => ({
  input: {
    phoneNumber: phoneNumber || casual.phone,
    confirmationCode: confirmationCode || casual.word,
    newPassword: newPassword || casual.password,
  },
})
export const createPasswordForgotConfirmInputFactory = factoryFactory(createPasswordForgotConfirmInput)

const createRefreshSessionInput = ({
  refreshToken,
}) => ({
  input: {
    refreshToken: refreshToken || casual.uuid,
  },
})
export const createRefreshSessionInputFactory = factoryFactory(createRefreshSessionInput)
