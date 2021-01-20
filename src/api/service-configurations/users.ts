import {RedisClient} from 'redis'
import {
  UserDetailsService,
  UserVerifyTokenService,
  UserListService,
  ValidateDuplicateEmailService
} from '../domain/services/users'
import {
  UserRepository
} from '../../app-plugins/persistence/repository'
import AuthToken from '../helper/user-token'
export const validateUserEmail = () => (
  new ValidateDuplicateEmailService({repositoryGateway: new UserRepository()})
)
export const userListService = () => (
  new UserListService({repositoryGateway: new UserRepository()})
)
export const userDetails = () => (
  new UserDetailsService({repositoryGateway: new UserRepository()})
)
export const userVerifyToken = (redis: RedisClient) => (
  new UserVerifyTokenService({
    userDetails: userDetails(),
    verifyToken: new AuthToken({redisClient: redis}).verifyAccessToken
  })
)