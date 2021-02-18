import {
  EmailAddressPattern
} from '../utils/regex-pattern'


export const validateEmailAddress = (email: string) => {
  return !(!(email.match(EmailAddressPattern)))
}