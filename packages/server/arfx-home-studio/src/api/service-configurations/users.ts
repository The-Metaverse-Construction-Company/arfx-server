import {RedisClient} from 'redis'
import {
  UserSignUp,
  SendEmailVerification,
  ValidateUserEmail,
  VerifyUser,
  UserList
} from '../domain/services/users'
import AuthToken from '../domain/services/auth/user-token'
import {
  generateToken,
  verifyToken
} from '../helper/token'

const dummyEmailSender = async (emailData: any) => {
  console.log('emailData :>> ', emailData);
  return true
}
export const validateUserEmail = () => (
  new ValidateUserEmail()
)
export const sendEmailVerification = () => (
  new SendEmailVerification({
    sendEmail: dummyEmailSender,
    repositoryGateway: <any> (() => ({}))
  })
)
export const userSignUp = (redis: RedisClient) => (
  new UserSignUp({
    generateToken: (new AuthToken({redisClient: redis})).generateAccessToken,
    sendEmail: sendEmailVerification().sendOne,
    validateEmail: validateUserEmail().validateOne
  })
)
export const verifyUser = (redis: RedisClient) => (
  new VerifyUser({
    verifyToken: new AuthToken({redisClient: redis}).verifyAccessToken
  })
)
export const userList = UserList()