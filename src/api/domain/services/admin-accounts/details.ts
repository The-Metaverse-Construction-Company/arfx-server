import { IGeneralServiceDependencies } from '../../interfaces'
import { 
  IAdminAccountRepositoryGateway,
 } from '../../entities/admin-accounts'
interface IServiceDependencies extends IGeneralServiceDependencies<IAdminAccountRepositoryGateway>{
}
export class AdminAccountDetailsService {
  constructor (protected deps: IServiceDependencies) {
  }
  /**
   * get the details of the admin account
   * @param id 
   */
  public getOne = async (id: string) => {
    try {
      const adminAccounts = await this.deps.repositoryGateway.findOne({
        _id: id
      }, {password: 0})
      //add some logs
      return adminAccounts
    } catch (error) {
      console.log('error :>> ', error);
      throw error
    }
  }
}