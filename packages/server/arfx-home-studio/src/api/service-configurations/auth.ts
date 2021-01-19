import {RedisClient} from 'redis'
import {
  UserSignIn
} from '../domain/services/auth'
import AuthToken from '../domain/services/auth/user-token'
import {
  generateToken,
  verifyToken
} from '../helper/token'
import bcrypt from 'bcryptjs'


export const userSignIn = (redis: RedisClient) => (
  new UserSignIn({
    comparePassword: bcrypt.compareSync,
    generateToken: new AuthToken({redisClient: redis}).generateAccessToken
  })
)