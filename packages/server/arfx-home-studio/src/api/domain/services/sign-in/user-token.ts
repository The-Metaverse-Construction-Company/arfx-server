
import {RedisClient} from 'redis'
import { TOKEN_LABEL } from '../../../utils/constants'
import Token from '../../../helper/token'
import {
  JWT_ACCESS_TOKEN_DURATION_MINUTES,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_DURATION_MINUTES,
  JWT_REFRESH_TOKEN_SECRET
} from '../../../utils/constants'
// import Token from '../../../helper/token'
// import { JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY, TOKEN_LABEL, PLATFORMS } from '../../use-cases/helper/constants'
// import Redis from '../../../../config/redis'
interface deps {
  // token: {
  //   generate(data: any, duration: number): Promise<string>
  //   verify(token: string): Promise<string>
  // }
  redisClient: RedisClient
}
export default class AuthToken {
  public AccessToken!: Token
  private RefreshToken!: Token
  constructor (protected deps: deps) {
  // constructor (client: RedisClient) {
    // super(AccountModel)
    // this.deps.redisClient = redisClient()
    this.setAccessTokenSecretKey(JWT_ACCESS_TOKEN_SECRET)
    this.setRefreshTokenSecretKey(JWT_REFRESH_TOKEN_SECRET)
  }

  private setAccessTokenSecretKey (secretKey: string) {
    return this.AccessToken = new Token(secretKey)
  }
  private setRefreshTokenSecretKey = (secretKey: string) => {
    return this.RefreshToken = new Token(secretKey)
  }
  private getKey (data: {referenceId: string, tokenType: string}, tokenLabel: string) {
    return `${data.referenceId}:${tokenLabel}:${data.tokenType}`
  }
  /**
   * generate the refresh token with fingerprint as a primary id
   * @param tokenData 
   * @param fingerprint 
   * @param duration expiration of the refresh token, default value is 30 days
   */
  public generateRefreshToken (tokenData: any, fingerprint: string, duration: number = (60 * 24) * 30):Promise<string> {
    return new Promise((resolve, reject) => {
      // get the refresh token,
      this.deps.redisClient.get(`${tokenData.sourceId}:${tokenData.platform}:${TOKEN_LABEL.REFRESH}:${fingerprint}`, (err: any, data: any) => {
        if (err) {
          console.log('Failed to generate refresh token, Error: ', err)
          return reject(`Failed to generate refresh token, Error: ${err.message}`)
        }
        if (data) {
          // return existing refresh token data.
          return resolve(data)
        }
        const {expiration, token} = this.RefreshToken.generate({...tokenData, fingerprint}, duration)
        // expiration return the current date plus the value on the token(by minute)
        this.deps.redisClient.SET(`${tokenData.sourceId}:${tokenData.platform}:${TOKEN_LABEL.REFRESH}:${fingerprint}`, token, 'EX', (expiration - Date.now()) / 1000)
        return resolve(token)
      })
    })
  }
  /**
   * verifying the refresh token with fingerprint
   * @param token 
   * @param fingerprint 
   */
  public verifyRefreshToken (token: string, fingerprint: string):Promise<string> {
    return new Promise((resolve, reject) => {
      this.RefreshToken
        .verify(token)
        .then((data: any) => {
          // check if the refresh token is exist
          this.deps.redisClient.EXISTS(`${data.sourceId}:${data.platform}:${TOKEN_LABEL.REFRESH}:${fingerprint}`, (err, isExist) => {
            if (err) {
              reject(new Error('Failed to verify refresh token. Error: ' + err.message))
              return
            }
            console.log('refresh token: ', isExist)
            console.log('refresh token: ', data)
            if (!isExist) {
              reject(new Error('Invalid refresh token.'))
              return
            }
            return resolve(data)
          })
        })
        .catch((err: Error) => {
          reject(err)
        })
      })
  }
  /**
   * generate the access token with fingerprint as a primary id
   * @param tokenData 
   * @param duration // accessToken expiration, default is 2 hrs, 
   */
  public generateAccessToken = (tokenData: any, duration: number = (60 * 2)):Promise<string> => {
  // public generateAccessToken (tokenData: any, fingerprint: string, _expiration: number = (60 * 2)):Promise<string> {
    return new Promise((resolve, reject) => {
      // get the access token
      this.deps.redisClient.get(this.getKey(tokenData, TOKEN_LABEL.ACCESS), (err, data) => {
      // this.deps.redisClient.get(`${tokenData.referenceId}:${tokenData.platform}:${TOKEN_LABEL.ACCESS}:${fingerprint}`, (err, data) => {
        if (err) {
          console.log('Failed to generate access token, Error: ', err)
          return reject(`Failed to generate access token, Error: ${err.message}`)
        }
        if (data) {
          return resolve(data)
        }
        try {
          // if no token found on redis, generate new token with 15 minutes expiration
          const {expiration, token} = this.AccessToken.generate({...tokenData}, duration)
          // expiration return the current date plus the value on the token(by minute)
          this.deps.redisClient.SET(this.getKey(tokenData, TOKEN_LABEL.ACCESS), token, 'EX', (expiration - Date.now()) / 1000)
          // this.deps.redisClient.SET(`${tokenData.sourceId}:${tokenData.platform}:${TOKEN_LABEL.ACCESS}:${fingerprint}`, token, 'EX', (expiration - Date.now()) / 1000)
          return resolve(token)
        }
        catch (error) {
          return reject(error)
        }

      })
    })
  }
  /**
   * verifying the access token with fingerprint
   * @param token 
   * @param fingerprint 
   */
  public verifyAccessToken = (token: string, tokenType: string):Promise<any> => {
    return new Promise((resolve, reject) => {
      this.AccessToken
        .verify(token)
        .then((data: any) => {
          console.log('this.getKey({...data, tokenType}, TOKEN_LABEL.ACCESS) :>> ', this.getKey({...data, tokenType}, TOKEN_LABEL.ACCESS));
          // check if the access token name with fingerprint within
          // console.log(' >> this.deps.redisClient', this.deps.redisClient)
          this.deps.redisClient.EXISTS(this.getKey({...data, tokenType}, TOKEN_LABEL.ACCESS), (err, isExist) => {
          // this.deps.redisClient.EXISTS(`${data.sourceId}:${data.platform}:${TOKEN_LABEL.ACCESS}:${fingerprint}`, (err, isExist) => {
            if (err) {
              reject(new Error('Failed to verify access token. Error: ' + err.message))
              return
            }
            if (!isExist) {
              reject(new Error('Invalid access token.'))
              return
            }
            return resolve(data)
          })
        })
        .catch(err => {
          reject(err)
        })
      })
  }
  /**
   * > prevent multiple login <
   * you have to do it this way just to be sure the scan is complete
   * if redis scan returns a zero cursor, it means the scan is complete.
   * Otherwise, you to have use the cursor for the next iteration, repeat this until the scan returns cursor 0
   * see https://stackoverflow.com/questions/28102173/redis-how-does-scan-cursor-state-management-work
   * @param accountId 
   * @param platform 
   * @param fingerprint 
   */
  // public async revokePlatformToken (accountId: string, platform: string, fingerprint: string) {
    // let cursor = 0
    // try {
    //   const scanTokens = (cursor: string): Promise<number> => {
    //     return new Promise((resolve, reject) => {
    //       this.deps.redisClient.scan(cursor, 'MATCH', `${accountId}:${platform}:*`, async (err, reply) => {
    //         if (err) {
    //           // fail safe
    //           reject(0)
    //         }
    //         if (reply[1].length !== 0) {
    //           const tokens = reply[1]
    //           for (let i in tokens) {
    //             this.deps.redisClient.del(tokens[i])
    //           }
    //           // wait to publish message before invalidating other device sessions
    //           await this.deps.redisClient.publish(`MULTIPLE_LOGIN`, JSON.stringify({accountId, platform, fingerprint}))
    //           return resolve(parseInt(reply[0]))
    //         }
    //         resolve(0)
    //       })
    //     })
    //   }
    //   do {
    //     if (!(platform === PLATFORMS.TV_DISPLAY)) {
    //       cursor = await scanTokens(cursor.toString())
    //     }
    //   }
    //   while (cursor !== 0) 
    //   return true
    // } catch (error) {
    //   console.log(' error on uploading ')
    //   throw error
    // }
  // }
  /**
   * Remove all token to specific fingerprint
   * @param fingerprint 
   */
  public removeTokens = async (accountId: string, platform: string, fingerprint: string) => {
    await this.removeAccessToken(accountId, platform)
    // await this.removeRefreshToken(accountId, platform)
    return true
  }
  /**
   * remove access token
   * @param referenceId 
   * @param platform 
   * @param fingerprint 
   */
  public removeAccessToken = (referenceId: string, tokenType: string) => {
    this.deps.redisClient.DEL(this.getKey({referenceId: referenceId, tokenType}, TOKEN_LABEL.ACCESS))
  }
  /**
   * remove refresh token
   * @param fingerprint 
   * @param accountId 
   * @param platform 
   */
  public removeRefreshToken = (accountId: string, platform: string, fingerprint: string) => {
    this.deps.redisClient.DEL(`${accountId}:${platform}:${TOKEN_LABEL.REFRESH}:${fingerprint}`)
  }
}