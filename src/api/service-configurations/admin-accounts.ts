
/**
 * @libraries
 */
import {RedisClient} from 'redis'
/**
 * @services
 */
import {
  AdminAccountDetailsService,
  AdminAccountListService,
  CreateAdminAccountService,
  UpdateAdminAccountService,
  AdminAccountSignInService,
  AdminAccountVerifyAuthTokenService,
  AdminAccountValidateEmailService
} from '../domain/services/admin-accounts'
/**
 * @repository
 */
import {
  AdminAccountRepository
} from '../../app-plugins/persistence/repository'

// import {
//   sendVerificationEmail
// } from './email'

import AuthToken from '../helper/admin-account-token'
import {compare} from '../helper/encryptor'
import MSGraphAPI from '../../app-plugins/api/ms-graph'
import {
  AZURE_AD_ACCOUNT_NAME,
  AZURE_AD_ADMIN_CLIENT_ID,
  AZURE_AD_ADMIN_CLIENT_SECRET_ID,
  AZURE_AD_ADMIN_CLIENT_SECRET_VALUE
} from '../../config/vars'
export const adminAccountValidateEmailService = () => (
  new AdminAccountValidateEmailService({
    repositoryGateway: new AdminAccountRepository(),
  })
)
export const createAdminAccountService = () => (
  new CreateAdminAccountService({
    repositoryGateway: new AdminAccountRepository(),
    adminAccountValidateEmailService: adminAccountValidateEmailService(),
    MSGraphAPI: new MSGraphAPI(AZURE_AD_ACCOUNT_NAME, AZURE_AD_ADMIN_CLIENT_ID, AZURE_AD_ADMIN_CLIENT_SECRET_VALUE)
    // generateToken: (new AuthToken({redisClient: redis})).generateAccessToken,
    // sendEmail: sendVerificationEmail().sendOne,
    // validateEmail: validateUserEmail().validateOne
  })
)
export const updateAdminAccountService = (redis: RedisClient) => (
  new UpdateAdminAccountService({
    repositoryGateway: new AdminAccountRepository(),
    adminAccountValidateEmailService: adminAccountValidateEmailService()
    // generateToken: (new AuthToken({redisClient: redis})).generateAccessToken,
    // sendEmail: sendVerificationEmail().sendOne,
    // validateEmail: validateUserEmail().validateOne
  })
)
export const adminAccountDetailsService = () => (
  new AdminAccountDetailsService({
    repositoryGateway: new AdminAccountRepository()
  })
)
export const adminAccountListService = () => (
  new AdminAccountListService({
    repositoryGateway: new AdminAccountRepository()
  })
)

export const adminAccountSignInService = (redis: RedisClient) => (
  new AdminAccountSignInService({
    repositoryGateway: new AdminAccountRepository(),
    comparePassword: compare,
    generateToken: new AuthToken(redis).generateAccessToken
  })
)

export const adminAccountVerifyAuthTokenService = (redis: RedisClient) => (
  new AdminAccountVerifyAuthTokenService({
    verifyToken: new AuthToken(redis).verifyAccessToken,
    adminAccountDetails: adminAccountDetailsService()
  })
)