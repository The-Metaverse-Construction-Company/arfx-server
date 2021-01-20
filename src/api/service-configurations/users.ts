import {RedisClient} from 'redis'
import {
  ValidateUserEmail,
  FindOneById,
  UserList,
  VerifyUserToken
} from '../domain/services/users'

import AuthToken from '../helper/user-token'
export const validateUserEmail = () => (
  new ValidateUserEmail()
)
export const userList = UserList()
export const findOneById = FindOneById()
export const verifyUserToken = (redis: RedisClient) => (
  new VerifyUserToken({
    findUserById: findOneById,
    verifyToken: new AuthToken({redisClient: redis}).verifyAccessToken
  })
)