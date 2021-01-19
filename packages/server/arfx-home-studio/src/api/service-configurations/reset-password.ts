import { RedisClient } from 'redis'
import {
  SendResetPassword,
  UpdateResetPassword,
  VerifyResetPassword
} from '../domain/services/reset-password'

import AuthToken from '../domain/services/sign-in/user-token'

import {
  findOneById
} from './users'
import {
  sendResetPasswordEmail
} from './email'

export const sendResetPassword = (redis: RedisClient) => (
  new SendResetPassword({
    findUserDetailsById: findOneById,
    generateToken: new AuthToken({redisClient: redis}).generateAccessToken,
    sendEmail: sendResetPasswordEmail().sendOne
  })
)
export const updateResetPassword = () => (
  new UpdateResetPassword({
    findUserDetailsById: findOneById
  })
)
export const verifyResetPassword = (redis: RedisClient) => (
  new VerifyResetPassword({
    verifyToken: new AuthToken({redisClient: redis}).verifyAccessToken,
  })
)