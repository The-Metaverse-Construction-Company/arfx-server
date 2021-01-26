
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
  AdminAccountVerifyAuthTokenService
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

export const createAdminAccountService = (redis: RedisClient) => (
  new CreateAdminAccountService({
    repositoryGateway: new AdminAccountRepository(),
    // generateToken: (new AuthToken({redisClient: redis})).generateAccessToken,
    // sendEmail: sendVerificationEmail().sendOne,
    // validateEmail: validateUserEmail().validateOne
  })
)
export const updateAdminAccountService = (redis: RedisClient) => (
  new UpdateAdminAccountService({
    repositoryGateway: new AdminAccountRepository(),
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