import jwt from `jsonwebtoken`
import { env, jwtSecret, jwtExpirationInterval } from '../../../config/vars'
/**
 * @services
 */

const generateToken = (payload: any) => {
  return jwt.encode({
    ...payload,
    exp: Date.now() * (jwtExpirationInterval * 1000),
    iat: Date.now(),
  }, jwtSecret)
}
const verifyToken = (token: string) => {
  return jwt.decode(token, jwtSecret)
}
const SendEmailVerification = require('./send-email-verification')({sendEmail: () => true})
const ValidateDuplicateEmail = require('./validate-email')()
const UserSignUp = require('./sign-up')({SendEmailVerification, ValidateDuplicateEmail, generateToken})

export {
  SendEmailVerification,
  ValidateDuplicateEmail,
  UserSignUp,
}