import { IGeneralServiceDependencies } from '../../interfaces'
import { 
  IAdminAccountRepositoryGateway,
 } from '../../entities/admin-accounts'
interface IServiceDependencies extends IGeneralServiceDependencies<IAdminAccountRepositoryGateway>{
}
export class AdminAccountValidateEmailService {
  constructor (protected deps: IServiceDependencies) {
  }
  /**
   * validate the email on the repository
   * @param email 
   * @param adminAccountId // ignore this adminAcountId on the repo if provided.
   */
  public validateOne = async (email: string, adminAccountId?: string) => {
    try {
      const adminAccount = await this.deps.repositoryGateway.findOne({
        //@ts-expect-error
        'email.value': email
      }, {password: 0})
      // add catch to ignore the built in error on the findOne on repository gateway.
      // .catch(() => null)
      if (adminAccount) {
        if (!adminAccountId || adminAccountId !== adminAccount._id) {
          throw new Error('email already exists.')
        }
      }
      //add some logs
      return adminAccount
    } catch (error) {
      console.log('error :>> ', error);
      throw error
    }
  }
}