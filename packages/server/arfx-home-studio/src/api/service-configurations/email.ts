import {
  SendResetPasswordEmail,
  SendVerificationEmail
} from '../domain/services/emails'
const dummyEmailSender = async (emailData: any) => {
  console.log('emailData :>> ', emailData);
  return true
}
export const sendVerificationEmail = () => (
  new SendVerificationEmail({
    sendEmail: dummyEmailSender,
    repositoryGateway: <any> (() => ({}))
  })
)
export const sendResetPasswordEmail = () => (
  new SendResetPasswordEmail({
    sendEmail: dummyEmailSender,
    repositoryGateway: <any> (() => ({}))
  })
)