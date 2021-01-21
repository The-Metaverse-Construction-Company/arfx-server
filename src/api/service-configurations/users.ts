import {RedisClient} from 'redis'
import {
  UserDetails,
  UserVerifyToken,
  UserList,
  ValidateDuplicateEmail
} from '../domain/services/users'
import {
  UserRepository
} from '../../app-plugins/persistence/repository'
import AuthToken from '../helper/user-token'
export const validateUserEmail = () => (
  new ValidateDuplicateEmail({repositoryGateway: new UserRepository()})
)
export const userListService = () => (
  new UserList({repositoryGateway: new UserRepository()})
)
export const userDetails = () => (
  new UserDetails({repositoryGateway: new UserRepository()})
)
export const userVerifyToken = (redis: RedisClient) => (
  new UserVerifyToken({
    userDetails: userDetails(),
    verifyToken: new AuthToken({redisClient: redis}).verifyAccessToken
  })
)