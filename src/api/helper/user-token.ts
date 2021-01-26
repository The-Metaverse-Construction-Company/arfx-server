import AuthToken from './auth-token'
interface IUserTokenData {
  referenceId: string
  tokenType: string
}
export default class UserToken extends AuthToken {
  /**
   * 
   * @param data 
   * @param authTokenType access
   */
  protected generateSourceId(data: IUserTokenData): string {
    return `ur:${data.referenceId}:${data.tokenType}`
  }
}