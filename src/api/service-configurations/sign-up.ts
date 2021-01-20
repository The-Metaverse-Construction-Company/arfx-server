import {RedisClient} from 'redis'
import {
  UserSignUp,
  VerifyUser,
  VerifyToken
} from '../domain/services/sign-up'
import {
  sendVerificationEmail
} from './email'
import {
  validateUserEmail,
  findOneById,
  verifyUserToken
} from './users'

import AuthToken from '../helper/user-token'
export const userSignUp = (redis: RedisClient) => (
  new UserSignUp({
    generateToken: (new AuthToken({redisClient: redis})).generateAccessToken,
    sendEmail: sendVerificationEmail().sendOne,
    validateEmail: validateUserEmail().validateOne
  })
)
export const verifyUser = (redis: RedisClient) => {
  const authToken = new AuthToken({redisClient: redis})
  return new VerifyUser({
    revokeToken: authToken.removeAccessToken,
    findOneById: findOneById
  })
}
export const verifySignUpToken = (redis: RedisClient) => {
  return new VerifyToken({
    verifyUserToken: verifyUserToken(redis)
  })
}