
import { IGeneralServiceDependencies, IGenerateToken } from '../../../interfaces'
import { 
  ADMIN_ACCOUNT_TOKEN_TYPES,
  IAdminAccountRepositoryGateway,
 } from '../../../entities/admin-accounts'
interface IServiceDependencies extends IGeneralServiceDependencies<IAdminAccountRepositoryGateway>{
  generateToken: IGenerateToken
  comparePassword(password: string, hashPassword: string): boolean
  // sendEmail(userId: string, token: string): Promise<any>
  // validateEmail(data: {email: string, userId?: string}): Promise<any>
}
export class AdminAccountSignInService {
  constructor (protected deps: IServiceDependencies) {
  }
  public signIn = async (username: string, password: string) => {
    try {
      const adminAccount = await this.deps.repositoryGateway.findOne({
        //@ts-expect-error
        "email.value": username,
      })
      if (!adminAccount) {
        throw new Error('Invalid credentials.')
      } else if (!this.deps.comparePassword(password, adminAccount.password)) {
        // can change the error msg or add more validations.
        throw new Error('Invalid credentials.')
      }
      // generate access token
      const token = await this.deps.generateToken({
        referenceId: adminAccount._id,
        tokenType: ADMIN_ACCOUNT_TOKEN_TYPES.SIGN_IN
      }, 60 * 4) // 4 hrs token duration
      // and some logs or send email notifications
      //@ts-ignore
      delete adminAccount.password
      return {
        admin: adminAccount,
        token
      }
    } catch (error) {
      console.log('error :>> ', error);
      throw error
    }
  }
}