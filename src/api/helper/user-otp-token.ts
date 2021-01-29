import OTPToken from './otp-token'
interface IOTPData {
  code: string
  tokenType: string
}
export default class UserOTPToken extends OTPToken {
  /**
   * 
   * @param data 
   * @param authTokenType access
   */
  protected generateSourceId(data: IOTPData): string {
    return `otp:${data.code}:${data.tokenType}`
  }
}