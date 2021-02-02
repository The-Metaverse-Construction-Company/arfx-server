import { RedisClient } from 'redis'
import {
  UserResetPasswordService,
  UserVerifyResetPasswordService,
} from '../domain/services/reset-password'

import UserOTP from '../helper/user-otp-token'

import {
  userDetails,
  updateUserPasswordService
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
    generateToken: new UserOTP({redisClient: redis}).generateOTPToken,
    sendEmail: sendResetPasswordEmail().sendOne
  })
)
export const updateResetPassword = (redis: RedisClient) => (
  new UserVerifyResetPasswordService({
    updateUserPasswordService: updateUserPasswordService(),
    revokeToken: new UserOTP({redisClient: redis}).removeOTPToken
  })
)