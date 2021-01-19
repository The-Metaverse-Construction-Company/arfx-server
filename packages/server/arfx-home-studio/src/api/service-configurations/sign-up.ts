import {RedisClient} from 'redis'
import {
  UserSignUp,
  VerifyUser,
} from '../domain/services/sign-up'
import {
  sendVerificationEmail
} from './email'
import {
  validateUserEmail
} from './users'

import AuthToken from '../domain/services/sign-in/user-token'
export const userSignUp = (redis: RedisClient) => (
  new UserSignUp({
    generateToken: (new AuthToken({redisClient: redis})).generateAccessToken,
    sendEmail: sendVerificationEmail().sendOne,
    validateEmail: validateUserEmail().validateOne
  })
)
export const verifyUser = (redis: RedisClient) => (
  new VerifyUser({
    verifyToken: new AuthToken({redisClient: redis}).verifyAccessToken
  })
)