/**
 * @general_interfaces
 */
import { IGenerateToken } from '../../interfaces'
interface IServiceDependencies {
// interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{
  generateToken: IGenerateToken
  sendEmail(userId: string, token: string): Promise<any>
}
export class SendUserOTPService {
  constructor (protected deps: IServiceDependencies) {
  }
  /**
   * send otp for users auth key
   * @param userId
   * @param tokenType 
   */
  public sendOne = async (userId: string, tokenType: string) => {
    try {
      // generate token for sign up
      const token = await this.deps.generateToken({
        referenceId: userId,
        tokenType
      })
      // enable send email to received a OTP on the Email
      await this.deps.sendEmail(userId, token)
      //add some logs
      return token
    } catch (error) {
      console.log('error :>> ', error);
      throw error
    }
  }
}