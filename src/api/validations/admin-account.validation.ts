import Joi from 'joi'
import {body} from 'express-validator'
import {adminAccountValidateEmailService} from '../service-configurations/admin-accounts'
import { HumanNamePattern } from '../utils/regex-pattern'
import {ADMIN_ROLE_LEVEL} from '../domain/entities/admin-accounts'
import enumExtract from 'ts-enum-extractor'
  // POST /v1/auth/register
const validateAdminEmail = async (value: string, {req}: any) => {
  try {
    // validate productId
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
    .custom(validateAdminEmail),
  body('roleLevel')
    .isIn(enumExtract.values(ADMIN_ROLE_LEVEL))
    .withMessage(`Invalid value of roleLevel. its either ${enumExtract.values(ADMIN_ROLE_LEVEL).join(', ')}.`)
]