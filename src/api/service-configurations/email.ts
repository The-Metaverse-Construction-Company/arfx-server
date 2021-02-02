import {
  SendEmailVerificationService,
  SendResetPasswordService
} from '../domain/services/emails'

import {
  UserRepository
} from '../../app-plugins/persistence/repository'
import { IEmailBody } from '../domain/interfaces'
import SendGrid from '../helper/email/sendgrid'

const sg = new SendGrid('testmail@mailnesia.com')
// need to change this to a functional one.
const sendEmail = async (emailData: IEmailBody) => {
  try {
    // *** DEVNOTE ***
    // disable sending mail for a while
    // sg.sendMail({
    //   title: 'Account Verification',
    //   email: `lalekidman@gmail.com`,
    //   // email: emailData.email,
    //   body: `Hi <b>${emailData.name}</br>,<br/><br/>` + 
    //   `<p>Please click this <a href='${emailData.url}' target='_blank'>link</a> to verify your account.</p><br/><br/>` + 
    //   `<i>ARFX Home</i>`
    // })
  } catch (error) {
    console.log('failed to send email :>> ', error);
    // ignore error
  }
  return true
}
export const sendVerificationEmail = () => (
  new SendEmailVerificationService({
    sendEmail: sendEmail,
    repositoryGateway: new UserRepository()
  })
)
export const sendResetPasswordEmail = () => (
  new SendResetPasswordService({
    sendEmail: sendEmail,
    repositoryGateway: new UserRepository()
  })
)