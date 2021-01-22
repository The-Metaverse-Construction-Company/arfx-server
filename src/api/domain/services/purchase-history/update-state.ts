import {
  IPurchaseHistorryRepositoryGateway, PURCHASE_HISTORY_STATE
} from '../../entities/purchase-history'
import { IGeneralServiceDependencies } from '../../interfaces';
interface IDependencies extends IGeneralServiceDependencies<IPurchaseHistorryRepositoryGateway> {
}
export class UpdatePurchaseStateService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * create purchase history
   * @param productBody 
   */
  public updateOne = async (purchaseId: string, state: PURCHASE_HISTORY_STATE) => {
    try {
      if (state === PURCHASE_HISTORY_STATE.PENDING) {
        throw new Error('Pending state is not allowed when the purchase already created.')
      }
      const updatedPurchase = await this.dependencies.repositoryGateway.updateOne({
        _id: purchaseId
      }, {
        state
      })
      return updatedPurchase
    } catch (error) {
      console.log('failed to update purchase status:>> ', error);
      throw error
    }
  }
}