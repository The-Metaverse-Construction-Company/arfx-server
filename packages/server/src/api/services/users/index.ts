import jwt from "jsonwebtoken"
import { env, jwtSecret, jwtExpirationInterval } from '../../../config/vars'
/**
 * @services
 */

const generateToken = (payload: any) => {
  return jwt.sign({
    ...payload,
    exp: Date.now() * (jwtExpirationInterval * 1000),
    iat: Date.now(),
  }, jwtSecret)
}
const verifyToken = (token: string) => {
  return jwt.verify(token, jwtSecret)
}
const SendEmailVerification = require('./send-email-verification')({sendEmail: () => true})
const ValidateDuplicateEmail = require('./validate-email')()
const UserSignUp = require('./sign-up')({SendEmailVerification, ValidateDuplicateEmail, generateToken})

export {
  SendEmailVerification,
  ValidateDuplicateEmail,
  UserSignUp,
}