/**
 * @lib
 */
import {RedisClient} from 'redis'
import {
  UserSignUpService,
  VerifyUserTokenService,
  VerifiedUserService
} from '../domain/services/sign-up'
/**
 * @services
 */
import {
  userDetails,
  userVerifyOTPToken,
  sendUserOTPService,
  createUserService,
  verifyUserService
} from './users'
/**
 * @repositories
 */
import {
  UserRepository
} from '../../app-plugins/persistence/repository'
/**
 * @helper
 */
import PaymentGateway from '../../config/payment-gateway'
import OTPToken from '../helper/user-otp-token'


export const userSignUp = (redis: RedisClient) => (
  new UserSignUpService({
    repositoryGateway: new UserRepository(),
    sendUserOTPService: sendUserOTPService(redis),
    createUserService: createUserService()
  })
)
export const verifyUser = (redis: RedisClient) => {
  const authToken = new OTPToken({redisClient: redis})
  return new VerifiedUserService({
    revokeToken: authToken.removeOTPToken,
    verifyUserService: verifyUserService()
  })
}
export const verifySignUpToken = (redis: RedisClient) => {
  return new VerifyUserTokenService({
    verifyUserToken: userVerifyOTPToken(redis)
  })
}