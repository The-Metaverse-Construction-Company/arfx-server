import {
  IPurchaseHistorryRepositoryGateway
} from '../../entities/purchase-history'
import { IGeneralServiceDependencies } from '../../interfaces';
interface IDependencies extends IGeneralServiceDependencies<IPurchaseHistorryRepositoryGateway> {}
export class PurchaseHistoryList {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * get purchase history lists
   * @param queryParams 
   */
  public getList = async (userId: string, queryParams?: any) => {
    try {
      // get list in the repo
      const purchaseHistoryList = await this.dependencies.repositoryGateway.findAll({
        userId
      })
      return purchaseHistoryList
    } catch (error) {
      console.log('failed to create product. \nError :>> ', error);
      throw error
    }
  }
}