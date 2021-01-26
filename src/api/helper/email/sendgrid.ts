// const sgMail = require('@sendgrid/mail')
import sgMail from '@sendgrid/mail'
import * as fs from 'fs'
// import hbs from 'hbs'
// const hbs = require('hbs')
import {
  SENDGRID_SECRET_KEY
} from '../../utils/constants'

export interface EmailData {
  email: string
  title: string
  bcc?: Array<string>
  body?: any
}
sgMail.setApiKey(SENDGRID_SECRET_KEY)
class SendGrid {
  private templatePath: string = ''
  private fileName: string = ''
  constructor (protected senderName: string) {}
  /**
   * set the template path or diretory of the templates.
   * @param path 
   */
  public setTemplatePath (path: string) {
    return this.templatePath = path
  }
  /**
   * send email
   * @param data 
   */
  public async sendMail(data: EmailData) {
    try {
      const {email, bcc = [], title, body} = data
      if (!email) {
        throw new Error('Email is required on sending email.')
      }
      console.log('Sending...')
      await sgMail.send({
        from: 'Kyoo<no-reply@kyoo.com',
        to: email,
        subject: `${title}`,
        html: body,
        bcc: bcc
      })
      console.log('email sent.')
      return true
    } catch (err) {
      console.log(' failed to send email template. Error: ', err.message)
      throw err
    }
  }
  /**
   * set email template
   * @param emailData 
   */
  // public sendEmailTemplate (emailData: EmailTemplateData) {
  //   const self = this
  //   const {title = '', email = '', data} = emailData
  //   const fileLoc = `${__dirname}/${self.templatePath}/${this.fileName}.hbs`
  //   const source = fs.readFileSync(fileLoc, 'utf8')
  //   const footerLoc = fs.readFileSync(`${__dirname}/${self.templatePath}/footer.hbs`, 'utf8')
  //   const headerLoc = fs.readFileSync(`${__dirname}/${self.templatePath}/header.hbs`, 'utf8')
  //   const templateEmail = hbs.compile(source)
  //   const footer = hbs.compile(footerLoc)
  //   const header = hbs.compile(headerLoc)
  //   data.date = moment().format('MMMM D YYYY')
  //   data.time = moment().format('h:mm a')
  //   const addtVariables = Object.assign(this.DefaultEmailVariables, this.customEmailVariables)
  //   const content = templateEmail(Object.assign(data, addtVariables, {Footer: footer(addtVariables), Header: header(addtVariables)}))
  //   return self.sendMail({
  //     email,
  //     title,
  //     body: content,
  //   })
  // }
}
export default SendGrid