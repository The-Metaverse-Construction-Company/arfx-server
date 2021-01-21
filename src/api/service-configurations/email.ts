import {
  SendEmailVerificationService,
  SendResetPasswordService
} from '../domain/services/emails'
const dummyEmailSender = async (emailData: any) => {
  console.log('emailData :>> ', emailData);
  return true
}
export const sendVerificationEmail = () => (
  new SendEmailVerificationService({
    sendEmail: dummyEmailSender,
    repositoryGateway: <any> (() => ({}))
  })
)
export const sendResetPasswordEmail = () => (
  new SendResetPasswordService({
    sendEmail: dummyEmailSender,
    repositoryGateway: <any> (() => ({}))
  })
)