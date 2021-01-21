import { RedisClient } from 'redis'
import {
  UserResetPasswordService,
  UserVerifyResetPasswordService,
} from '../domain/services/reset-password'

import AuthToken from '../helper/user-token'

import {
  userDetails
} from './users'
import {
  sendResetPasswordEmail
} from './email'
import {
  UserRepository
} from '../../app-plugins/persistence/repository'

export const sendResetPassword = (redis: RedisClient) => (
  new UserResetPasswordService({
    repositoryGateway: new UserRepository(),
    generateToken: new AuthToken({redisClient: redis}).generateAccessToken,
    sendEmail: sendResetPasswordEmail().sendOne
  })
)
export const updateResetPassword = (redis: RedisClient) => (
  new UserVerifyResetPasswordService({
    repositoryGateway: new UserRepository(),
    userDetails: userDetails(),
    revokeToken: new AuthToken({redisClient: redis}).removeAccessToken
  })
)