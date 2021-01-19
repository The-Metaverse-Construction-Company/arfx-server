import {
  UserSignUp,
  SendEmailVerification,
  ValidateUserEmail
} from '../domain/services/users'

import {
  generateToken,
  verifyToken
} from '../helper/token'

const dummyEmailSender = async (emailData: any) => {
  console.log('emailData :>> ', emailData);
  return true
}
export const validateUserEmail = () => (
  new ValidateUserEmail()
)
export const sendEmailVerification = () => (
  new SendEmailVerification({
    sendEmail: dummyEmailSender,
    repositoryGateway: <any> (() => ({}))
  })
)
export const userSignUp = () => (
  new UserSignUp({
    generateToken: generateToken,
    sendEmail: sendEmailVerification().sendOne,
    validateEmail: validateUserEmail().validateOne
  })
)