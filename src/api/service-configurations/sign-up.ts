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
  userVerifyToken
} from './users'

import {
  UserRepository
} from '../../app-plugins/persistence/repository'

import AuthToken from '../helper/user-token'
export const userSignUp = (redis: RedisClient) => (
  new UserSignUpService({
    repositoryGateway: new UserRepository(),
    generateToken: (new AuthToken({redisClient: redis})).generateAccessToken,
    sendEmail: sendVerificationEmail().sendOne,
    validateEmail: validateUserEmail().validateOne
  })
)
export const verifyUser = (redis: RedisClient) => {
  const authToken = new AuthToken({redisClient: redis})
  return new VerifiedUserService({
    revokeToken: authToken.removeAccessToken,
    repositoryGateway: new UserRepository(),
    userDetails: userDetails(),
    createPaymentGatewayAccount: PaymentGateway.customer.create,
  })
}
export const verifySignUpToken = (redis: RedisClient) => {
  return new VerifyUserTokenService({
    verifyUserToken: userVerifyToken(redis)
  })
}