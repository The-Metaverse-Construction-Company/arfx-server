import { IGeneralServiceDependencies } from '../../interfaces'
import { 
  IAdminAccountRepositoryGateway,
 } from '../../entities/admin-accounts'
interface IServiceDependencies extends IGeneralServiceDependencies<IAdminAccountRepositoryGateway>{
}
export class AdminAccountListService {
  constructor (protected deps: IServiceDependencies) {
  }
  /**
   * get list of the admin accounts
   * @param requestQuery 
   */
  public getList = async (requestQuery: any) => {
    try {
      const adminAccounts = await this.deps.repositoryGateway.getPaginationList({
        limit: requestQuery.limit,
        pageNo: requestQuery.pageNo,
        searchText: requestQuery.searchText
      })
      //add some logs
      return adminAccounts
    } catch (error) {
      console.log('error :>> ', error);
      throw error
    }
  }
}