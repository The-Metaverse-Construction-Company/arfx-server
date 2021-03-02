/**
 * @libraries
 */
import { RedisClient } from 'redis'
/**
 * @auth
 */
import AuthToken from './auth-token'
/**
 * @utils/helpers
 */
import {
  ADMIN_JWT_ACCESS_TOKEN_SECRET,
  ADMIN_JWT_REFRESH_TOKEN_SECRET
} from '../../config/vars'
interface IUserTokenData {
  referenceId: string
  tokenType: string
}
export default class AdminAuthToken extends AuthToken {

  constructor (redis: RedisClient) {
    super({
      redisClient: redis,
      accessTokenSecret: ADMIN_JWT_ACCESS_TOKEN_SECRET,
      refreshTokenSecret: ADMIN_JWT_REFRESH_TOKEN_SECRET,
    })
  }
  /**
   * 
   * @param data 
   * @param authTokenType access
   */
  protected generateSourceId(data: IUserTokenData): string {
    return `ad:${data.referenceId}:${data.tokenType}`
  }
}