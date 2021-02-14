
import {RedisClient} from 'redis'
import RandomNumber from 'random-number'
import { TOKEN_LABEL,
  JWT_ACCESS_TOKEN_DURATION_MINUTES,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_DURATION_MINUTES,
  JWT_REFRESH_TOKEN_SECRET} from '../utils/constants'
import Token from './token'
const RNOptions = {
  min: 10000,
  max: 99999,
  integer: true
}
const generateOTP = RandomNumber.generator(RNOptions)
// import Token from '../../../helper/token'
// import { JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY, TOKEN_LABEL, PLATFORMS } from '../../use-cases/helper/constants'
// import Redis from '../../../../config/redis'
interface deps {
  redisClient: RedisClient
}
export default abstract class AuthOTPToken {
  protected abstract generateSourceId(data:any): string;
  constructor (protected deps: deps) {
  }
  /**
   * generate the access token with fingerprint as a primary id
   * @param tokenData 
   * @param duration // accessToken expiration, default is 2 hrs, 
   */
  public generateOTPToken = (tokenData: any, duration: number = 60 * 15):Promise<string> => {
    return new Promise((resolve, reject) => {
      const otpCode = generateOTP().toString()
      const authKey = `${this.generateSourceId({
        ...tokenData,
        code: otpCode
      })}`
      // get the access token
      this.deps.redisClient.get(authKey, (err, data) => {
      // this.deps.redisClient.get(`${tokenData.referenceId}:${tokenData.platform}:${TOKEN_LABEL.ACCESS}:${fingerprint}`, (err, data) => {
        if (err) {
          console.log('Failed to generate access token, Error: ', err)
          return reject(`Failed to generate access token, Error: ${err.message}`)
        }
        if (data) {
          // if the 
          return this.generateOTPToken(tokenData, duration)
        }
        try {
          // if no token found on redis, generate new token with 15 minutes expiration
          // const {expiration, token} = this.AccessToken.generate({...tokenData}, duration)
          // expiration return the current date plus the value on the token(by minute)
          this.deps.redisClient.SET(authKey, JSON.stringify(tokenData), 'EX', duration)
          return resolve(otpCode)
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
  public verifyOTPToken = (otpCode: string, tokenType: string):Promise<any> => {
    return new Promise((resolve, reject) => {
      console.log('object :>> ', this.generateSourceId({
        code: otpCode,
        tokenType
      }));
        this.deps.redisClient.GET(this.generateSourceId({
          code: otpCode,
          tokenType
        }), (err, data) => {
          console.log('data :>> ', data);
          if (err) {
            reject(new Error('Failed to verify otp token. Error: ' + err.message))
            return
          }
          if (!data) {
            reject(new Error('Invalid otp token.'))
            return
          }
          return resolve(JSON.parse(data))
        })
      })
  }
  /**
   * remove access token
   * @param referenceId 
   * @param platform 
   * @param fingerprint 
   */
  public removeOTPToken = async (otpCode: string, tokenType: string) => {
    try {
      this.deps.redisClient.DEL(this.generateSourceId({code: otpCode, tokenType}))
      return true
    } catch (error) {
      throw error
    }
  }
}