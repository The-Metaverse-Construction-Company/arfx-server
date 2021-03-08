import {body} from 'express-validator'
import {adminAccountValidateEmailService} from '../service-configurations/admin-accounts'
import { EmailAddressPattern, HumanNamePattern } from '../utils/regex-pattern'
import {ADMIN_ROLE_LEVEL} from '../domain/entities/admin-accounts'
import enumExtract from 'ts-enum-extractor'
import { validateEmailDomain } from '../helper'
  // POST /v1/auth/register
const validateAdminEmail = async (value: string, {req}: any) => {
  try {
    // validate productId
    if (!validateEmailDomain(value)) {
      throw new Error(`Invalid email organization domain.`)
    }
    await adminAccountValidateEmailService().validateOne(value).catch(() => {
      throw new Error('email address is already exist on the repository.')
    })
    return true
  } catch (error) {
    throw error
  }
}
export const FormPipeline = [
  body('firstName')
    .isString()
    .matches(HumanNamePattern),
  body('lastName')
    .isString()
    .matches(HumanNamePattern),
  body('password')
    .isString(),
  body('email')
    .matches(EmailAddressPattern)
    .withMessage('Invalid email address format.')
    .bail()
    .custom(validateAdminEmail),
  body('roleLevel')
    .isIn(enumExtract.values(ADMIN_ROLE_LEVEL))
    .withMessage(`Invalid value of roleLevel. its either ${enumExtract.values(ADMIN_ROLE_LEVEL).join(', ')}.`)
]
export const SignInFormValidationPipeline = [
  body('username')
    .matches(EmailAddressPattern)
    .withMessage('Invalid email address format.'),
  body('password')
    .isString()
    .withMessage('password must not be empty.')
]