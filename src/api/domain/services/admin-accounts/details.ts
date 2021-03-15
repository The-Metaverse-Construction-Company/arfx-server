/**
 * @admin_entity
 */
import { 
  IAdminAccountRepositoryGateway,
 } from '../../entities/admin-accounts'
 /**
  * @general_interfaces
  */
 import { IGeneralServiceDependencies } from '../../interfaces'
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
      .catch(() => {
        // just overwrite the error when there's no data found.
        throw new Error('No admin account found.')
      })
      //add some logs
      return adminAccounts
    } catch (error) {
      console.log('error :>> ', error);
      throw error
    }
  }
  /**
   * get the details of the admin account
   * @param id 
   */
  public getOneByAzureAdId = async (azureAdId: string) => {
    try {
      const adminAccounts = await this.deps.repositoryGateway.findOne({
        //@ts-expect-error
        'oauth.azureAd': azureAdId
      }, {password: 0})
      .catch(() => {
        // just overwrite the error when there's no data found.
        throw new Error('No admin account found.')
      })
      //add some logs
      return adminAccounts
    } catch (error) {
      console.log('error :>> ', error);
      throw error
    }
  }
}