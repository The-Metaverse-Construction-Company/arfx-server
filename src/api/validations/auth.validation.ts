import {
  validateUserEmail
} from '../service-configurations/users'
import {
  body, query
} from 'express-validator'
import { EmailAddressPattern } from '../utils/regex-pattern'
const validateDuplicateEmail = async (value: string) => {
  try {
    await validateUserEmail()
      .validateOne({email: value})
    return true
  } catch (error) {
    throw new Error('Email already exists.')
  }
}
export const signUpValidationPipeline = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format.')
    .bail()
    .custom(validateDuplicateEmail),
  body('password')
    .isString()
    .isLength({max: 50, min: 6})
    .withMessage('password must be greater than 6 characters and maximum 50 characters.'),
  body('name')
    .isString()
    .isLength({max: 50, min: 2})
    .withMessage('name must be greater than 2 characters and maximum 50 characters.')
]
export const updateResetPasswordValidation = [
  body('password')
    .isLength({
      min: 6,
      max: 128
    })
]
  // POST /v1/auth/login
export const signInValidationPipeline = [
  body('username')
    .isString()
    .withMessage('must be a string.'),
  body('password')
    .isString()
    .withMessage('must be a string.')
]
export const sendPasswordReset = [
  body('email')
    .matches(EmailAddressPattern)
    .withMessage('invalid email address format.')
]
//   // GET /v1/auth/reset-password
export const verifyResetPasswordToken = [
  query('token')
    .isString()
    .withMessage('must be a string.')
]
// POST /v1/auth/facebook
// POST /v1/auth/google
// export const oAuth = {
//   body: {
//     access_token: Joi.string().required(),
//   },
// }
// // POST /v1/auth/refresh
// export const refresh = {
//   body: {
//     email: Joi.string()
//       .email()
//       .required(),
//     refreshToken: Joi.string().required(),
//   },
// }
//   // POST /v1/auth/reset-password

// POST /v1/auth/password-reset
