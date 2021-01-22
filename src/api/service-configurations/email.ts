import {
  SendEmailVerificationService,
  SendResetPasswordService
} from '../domain/services/emails'

import {
  UserRepository
} from '../../app-plugins/persistence/repository'
// need to change this to a functional one.
const dummyEmailSender = async (emailData: any) => {
  return true
}
export const sendVerificationEmail = () => (
  new SendEmailVerificationService({
    sendEmail: dummyEmailSender,
    repositoryGateway: new UserRepository()
  })
)
export const sendResetPasswordEmail = () => (
  new SendResetPasswordService({
    sendEmail: dummyEmailSender,
    repositoryGateway: new UserRepository()
  })
)