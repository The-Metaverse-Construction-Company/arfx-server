import {
  EmailAddressPattern, EmailDomainPattern
} from '../utils/regex-pattern'


export const validateEmailAddress = (email: string) => {
  return !(!(email.match(EmailAddressPattern)))
}
export const validateEmailDomain = (email: string) => {
  return !(!(email.match(EmailDomainPattern)))
}