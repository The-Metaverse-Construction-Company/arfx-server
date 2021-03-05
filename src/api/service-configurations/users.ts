import {RedisClient} from 'redis'
import bcrypt from 'bcryptjs'

import {
  UserDetailsService,
  UserVerifyTokenService,
  UserListService,
  ValidateDuplicateEmailService,
  SendUserOTPService,
  UpdateUserPasswordService,
  ValidateUserPasswordService,
  CreateUserService,
  UpdateUserService,
  UpdateUserSuspendStatusService,
  VerifyUserService
} from '../domain/services/users'
import {
  UserRepository
} from '../../app-plugins/persistence/repository'

import PaymentGateway from '../../config/payment-gateway'

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
export const createUserService = () => (
  new CreateUserService({
    repositoryGateway: new UserRepository(),
    validateEmail: validateUserEmail().validateOne
  })
)
export const updateUserService = () => (
  new UpdateUserService({
    repositoryGateway: new UserRepository(),
    userDetailsService: userDetails(),
    validateEmail: validateUserEmail().validateOne
  })
)
export const userVerifyToken = (redis: RedisClient) => (
  new UserVerifyTokenService({
    userDetails: userDetails(),
    verifyToken: new AuthToken({redisClient: redis}).verifyAccessToken
  })
)
export const verifyUserService = () => (
  new VerifyUserService({
    userDetails: userDetails(),
    createPaymentGatewayAccount: PaymentGateway.customer.create,
    repositoryGateway: new UserRepository()
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
    sendEmail: async () => true
    // sendEmail: sendVerificationEmail().sendOne
  })
)
export const updateUserPasswordService = () => (
  new UpdateUserPasswordService({
    repositoryGateway: new UserRepository()
  })
)
export const updateUserSuspendStatusService = () => (
  new UpdateUserSuspendStatusService({
    repositoryGateway: new UserRepository()
  })
)
export const validateUserPasswordService = () => (
  new ValidateUserPasswordService({
    comparePassword: bcrypt.compareSync,
    repositoryGateway: new UserRepository()
  })
)