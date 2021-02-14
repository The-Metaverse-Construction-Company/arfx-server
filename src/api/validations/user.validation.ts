import Joi from 'joi'
import {body} from 'express-validator'
import {
  ALLOWED_USER_ROLE
} from '../domain/entities/users'
import { EmailAddressPattern, HumanNamePattern } from '../utils/regex-pattern'
const allowed_roles = Object.values(ALLOWED_USER_ROLE)
// GET /v1/users
export const listUsers = {
  query: {
    page: Joi.number().min(1),
    perPage: Joi.number().min(1).max(100),
    name: Joi.string(),
    email: Joi.string(),
    role: Joi.string().valid(allowed_roles),
  },
}
// POST /v1/users
export const createUser = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    name: Joi.string().max(128),
    role: Joi.string().valid(allowed_roles),
  },
}

export const UserFormValidationPipeline = [
  body('email')
    .isString()
    .withMessage('Invalid variable type. must be string.')
    .bail()
    .matches(EmailAddressPattern)
    .withMessage('Invalid email address format.'),
  body('name')
    .isString()
    .matches(HumanNamePattern),
  body('role')
    .isString()
    .isIn(allowed_roles)
    .optional()
]
export const createUserPipeline = [
  ...UserFormValidationPipeline,
  body('password')
    .isString(),
    // .matches() // enable to if you already have a pattern for the password.
]
// PUT /v1/users/:userId
export const replaceUser = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    name: Joi.string().max(128),
    role: Joi.string().valid(allowed_roles),
  },
  params: {
    userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
  },
}
// PATCH /v1/users/:userId
export const updateUser = {
  body: {
    email: Joi.string().email(),
    password: Joi.string().min(6).max(128),
    name: Joi.string().max(128),
    role: Joi.string().valid(allowed_roles),
  },
  params: {
    userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
  },
}