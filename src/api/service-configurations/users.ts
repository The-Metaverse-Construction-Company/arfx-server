import {RedisClient} from 'redis'
import bcrypt from 'bcryptjs'

import {
  UserDetailsService,
  UserVerifyTokenService,
  UserListService,
  ValidateDuplicateEmailService,
  SendUserOTPService,
  UpdateUserPasswordService,
  ValidateUserPasswordService
} from '../domain/services/users'
import {
  UserRepository
} from '../../app-plugins/persistence/repository'
import AuthToken from '../helper/user-token'
import OTPToken from '../helper/user-otp-token'
import { sendVerificationEmail } from './email'
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
export const userVerifyOTPToken = (redis: RedisClient) => (
  new UserVerifyTokenService({
    userDetails: userDetails(),
    verifyToken: new OTPToken({redisClient: redis}).verifyOTPToken
  })
)

export const sendUserOTPService = (redis: RedisClient) => (
  new SendUserOTPService({
    generateToken: (new OTPToken({redisClient: redis})).generateOTPToken,
    sendEmail: sendVerificationEmail().sendOne
  })
)
export const updateUserPasswordService = () => (
  new UpdateUserPasswordService({
    repositoryGateway: new UserRepository()
  })
)
export const validateUserPasswordService = () => (
  new ValidateUserPasswordService({
    comparePassword: bcrypt.compareSync,
    repositoryGateway: new UserRepository()
  })
)