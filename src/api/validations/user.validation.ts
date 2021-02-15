import {body, query} from 'express-validator'
import {
  ALLOWED_USER_ROLE
} from '../domain/entities/users'
import { EmailAddressPattern, HumanNamePattern } from '../utils/regex-pattern'
import { PaginationQueryPipeline } from '.'
const allowed_roles = Object.values(ALLOWED_USER_ROLE)
// GET /v1/users
export const UserListValidationPipeline = [
  ...PaginationQueryPipeline,
  query('role')
    .isIn(allowed_roles)
    .withMessage(`Invalid role value. is either ${allowed_roles.join(', ')}.`)
]
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