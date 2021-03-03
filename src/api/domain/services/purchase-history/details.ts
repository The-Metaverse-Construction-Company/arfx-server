/**
 * @entity_interfaces
 */
import {
  IPurchaseHistorryRepositoryGateway
} from '../../entities/purchase-history'
/**
 * @general_interfaces
 */
import { IGeneralServiceDependencies } from '../../interfaces';
interface IServiceDependencies extends IGeneralServiceDependencies<IPurchaseHistorryRepositoryGateway> {}
export class PurchaseHistoryDetailsService {
  constructor(protected dependencies: IServiceDependencies) {
  }
  /**
   * find purchase history details
   * @param productBody 
   */
  public getOne = async (userId: string, purchaseHistoryId: string) => {
    try {
      // get the purchase history details.
      const purchaseHistory = await this.dependencies.repositoryGateway.findOne({
        _id: purchaseHistoryId,
        userId: userId
      })
      return purchaseHistory
    } catch (error) {
      console.log('failed to find purchase history details. \nError :>> ', error);
      throw error
    }
  }
}