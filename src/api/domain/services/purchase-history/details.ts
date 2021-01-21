import {
  IPurchaseHistorryRepositoryGateway
} from '../../entities/purchase-history'
import { IGeneralServiceDependencies } from '../../interfaces';
interface IDependencies extends IGeneralServiceDependencies<IPurchaseHistorryRepositoryGateway> {}
export class PurchaseHistoryDetails {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * find purchase history details
   * @param productBody 
   */
  public findOne = async (purchaseHistoryId: string) => {
    try {
      // get list in the repo
      const purchaseHistory = await this.dependencies.repositoryGateway.findOne({
        _id: purchaseHistoryId
      })
      return purchaseHistory
    } catch (error) {
      console.log('failed to find purchase history details. \nError :>> ', error);
      throw error
    }
  }
}