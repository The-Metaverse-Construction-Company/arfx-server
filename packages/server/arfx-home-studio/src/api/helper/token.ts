import jwt from "jsonwebtoken"
import { env, jwtSecret, jwtExpirationInterval } from '../../config/vars'
class Token {
  private jwt: any
  private DEFAULT_SECRET_KEY: string = ''
  private signOptions: any = {}
  constructor (secretKey = 'SAMPLE_DEFAULT_SECRET_KEY_THAT_SHOULD_NOT_BE_SHARED') {
    this.jwt = jwt
    this.setSecretKey(secretKey)
  }
  /**
   * set secret key for jwt
   * @param secretKey 
   */
  public setSecretKey (secretKey: string) {
    return this.DEFAULT_SECRET_KEY = secretKey
  }
  /**
   * set addt options for token
   * @param data 
   */
  public setOptions(data:any = {}) {
    const {subject, issuer, audience} = data
    return this.signOptions = Object.assign({}, (subject ? {subject} : {}), (audience ? {audience} : {}), (issuer ? {issuer} : {}))
  }
  /**
   * generate new token
   * @param data // data that needed to attach to the token
   * @param duration by minutes. default 5
   * @param opt /addt option for generate new token
   */
  public generate (data: any, duration:number = 5, opt = null) {
    const expiration = duration ? {expiresIn: (Math.floor(60 * duration))} : null
    const options = Object.assign(opt || {}, expiration || {}, this.signOptions)
    return {
      token: this.jwt.sign(data, this.DEFAULT_SECRET_KEY, options),
      expiration: expiration ? (expiration.expiresIn * 1000) + Date.now() : 0
    }
  }
  /**
   * verify the token
   * @param token 
   * @param opt 
   */
  public verify (token: string, opt: any = null):Promise<object> {
    return new Promise((resolve, reject) => {
      const options = Object.assign(opt ? this.setOptions(opt) : this.signOptions)
      this.jwt.verify(token, this.DEFAULT_SECRET_KEY, options, (err : any, decoded: any) => {
        if (!err) {
          resolve(decoded)
        } else {
          reject(err)
        }
      })
    })
  }
}
export default Token
/**
 * @services
 */

export const generateToken = (payload: any) => {
  return jwt.sign({
    ...payload,
    exp: Date.now() * (jwtExpirationInterval * 1000),
    iat: Date.now(),
  }, jwtSecret)
}
export  const verifyToken = (token: string) => {
  return jwt.verify(token, jwtSecret)
}