import {RedisClient} from 'redis'
import {
  UserSignInService,
  UserSignOutService
} from '../domain/services/sign-in'
import AuthToken from '../helper/user-token'
import bcrypt from 'bcryptjs'

import {
  UserRepository
} from '../../app-plugins/persistence/repository'


export const userSignInService = (redis: RedisClient) => (
  new UserSignInService({
    repositoryGateway: new UserRepository(),
    comparePassword: bcrypt.compareSync,
    generateToken: new AuthToken({redisClient: redis}).generateAccessToken
  })
)

export const userSignOutService = (redis: RedisClient) => (
  new UserSignOutService({
    revokeToken: new AuthToken({redisClient: redis}).removeAccessToken
  })
)