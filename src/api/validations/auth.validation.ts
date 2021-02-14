import Joi from 'joi'
import {
  validateUserEmail
} from '../service-configurations/users'
import {
  body
} from 'express-validator'
const validateDuplicateEmail = async (value: string) => {
  try {
    await validateUserEmail()
      .validateOne({email: value})
    return true
  } catch (error) {
    throw new Error('Email already exists.')
  }
}
  // POST /v1/auth/register
export const register = {
  body: {
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required()
      .min(6)
      .max(128),
  },
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
  // POST /v1/auth/login
export const login = {
  body: {
    username: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required()
      .max(128),
  },
}
// POST /v1/auth/facebook
// POST /v1/auth/google
export const oAuth = {
  body: {
    access_token: Joi.string().required(),
  },
}
// POST /v1/auth/refresh
export const refresh = {
  body: {
    email: Joi.string()
      .email()
      .required(),
    refreshToken: Joi.string().required(),
  },
}
  // POST /v1/auth/reset-password
export const sendPasswordReset = {
  body: {
    email: Joi.string()
      .email()
      .required(),
  },
}
  // GET /v1/auth/reset-password
export const verifyResetPasswordToken = {
  query: {
    token: Joi.string()
      .required(),
  },
}
// POST /v1/auth/password-reset
export const updateResetPasswordValidation = {
  body: {
    password: Joi.string()
      .required()
      .min(6)
      .max(128)
  },
}