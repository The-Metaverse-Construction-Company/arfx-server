import {RedisClient} from 'redis'
import {
  UserSignIn
} from '../domain/services/sign-in'
import AuthToken from '../domain/services/sign-in/user-token'
import bcrypt from 'bcryptjs'


export const userSignIn = (redis: RedisClient) => (
  new UserSignIn({
    comparePassword: bcrypt.compareSync,
    generateToken: new AuthToken({redisClient: redis}).generateAccessToken
  })
)