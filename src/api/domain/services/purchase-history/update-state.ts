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
   * update the state of the puchase.
   * @param pmId // paymentMethodId from the payment gateway.
   * @param state PURCHASE_HISTORY_STATE
   */
  public updateOne = async (pmId: string, state: PURCHASE_HISTORY_STATE) => {
    try {
      if (state === PURCHASE_HISTORY_STATE.PENDING) {
        throw new Error('Pending state is not allowed when the purchase already created.')
      }
      const updatedPurchase = await this.dependencies.repositoryGateway.updateOne({
        paymentMethodId: pmId
      }, {
        state
      })
      return updatedPurchase
    } catch (error) {
      console.log('failed to update purchase status:>> ', error.message);
      throw error
    }
  }
}