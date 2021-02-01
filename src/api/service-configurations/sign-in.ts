/**
 * @libaries
 */
import {RedisClient} from 'redis'
import bcrypt from 'bcryptjs'
/**
 * @services
 */
import {
  UserSignInService,
  UserSignOutService
} from '../domain/services/sign-in'
import {
  validateUserPasswordService
} from './users'
/**
 * @repositories
 */
import {
  UserRepository
} from '../../app-plugins/persistence/repository'
/**
 * @helper
 */
import AuthToken from '../helper/user-token'

export const userSignInService = (redis: RedisClient) => (
  new UserSignInService({
    repositoryGateway: new UserRepository(),
    validateUserPasswordService: validateUserPasswordService(),
    generateToken: new AuthToken({redisClient: redis}).generateAccessToken
  })
)

export const userSignOutService = (redis: RedisClient) => (
  new UserSignOutService({
    revokeToken: new AuthToken({redisClient: redis}).removeAccessToken
  })
)