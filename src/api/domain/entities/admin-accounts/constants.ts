import {extractValue} from 'ts-enum-extractor'
export enum ADMIN_ROLE_LEVEL {
  SUPER_ADMIN = 1,
  ADMIN = 2,
  USER = 5,
}
export enum ADMIN_ACCOUNT_TOKEN_TYPES {
  SIGN_IN = 'SIGN-IN'
}
export const ALLOWED_ADMIN_ROLE_LEVEL = extractValue(ADMIN_ROLE_LEVEL)