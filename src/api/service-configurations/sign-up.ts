import PaymentGateway from '../../config/payment-gateway'

import {RedisClient} from 'redis'
import {
  UserSignUpService,
  VerifyUserTokenService,
  VerifiedUserService
} from '../domain/services/sign-up'
import {
  sendVerificationEmail
} from './email'
import {
  validateUserEmail,
  userDetails,
  userVerifyOTPToken,
  sendUserOTPService
} from './users'

import {
  UserRepository
} from '../../app-plugins/persistence/repository'

import OTPToken from '../helper/user-otp-token'


export const userSignUp = (redis: RedisClient) => (
  new UserSignUpService({
    repositoryGateway: new UserRepository(),
    sendUserOTPService: sendUserOTPService(redis),
    validateEmail: validateUserEmail().validateOne
  })
)
export const verifyUser = (redis: RedisClient) => {
  const authToken = new OTPToken({redisClient: redis})
  return new VerifiedUserService({
    revokeToken: authToken.remoteOTPToken,
    repositoryGateway: new UserRepository(),
    userDetails: userDetails(),
    createPaymentGatewayAccount: PaymentGateway.customer.create,
  })
}
export const verifySignUpToken = (redis: RedisClient) => {
  return new VerifyUserTokenService({
    verifyUserToken: userVerifyOTPToken(redis)
  })
}