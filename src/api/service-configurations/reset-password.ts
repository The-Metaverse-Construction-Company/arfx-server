import { RedisClient } from 'redis'
import {
  SendResetPassword,
  UpdateResetPassword,
} from '../domain/services/reset-password'

import AuthToken from '../helper/user-token'

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
export const updateResetPassword = (redis: RedisClient) => (
  new UpdateResetPassword({
    findUserDetailsById: findOneById,
    revokeToken: new AuthToken({redisClient: redis}).removeAccessToken
  })
)