import {
  IPurchaseHistorryRepositoryGateway, PURCHASE_HISTORY_STATE
} from '../../entities/purchase-history'
import { IGeneralServiceDependencies } from '../../interfaces';
import { CreateUserProductsService } from '../user-products';
interface IDependencies extends IGeneralServiceDependencies<IPurchaseHistorryRepositoryGateway> {
  createUserProductsService: CreateUserProductsService
}
export class UpdatePurchaseStateService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * update the state of the puchase.
   * @param paymentIntentId // paymentMethodId from the payment gateway.
   * @param paymentMethodId // payment charge id from the payment gateway.
   * @param state PURCHASE_HISTORY_STATE
   */
  public updateOne = async (paymentIntentId: string, paymentMethodId: string, state: PURCHASE_HISTORY_STATE) => {
    try {
      if (state === PURCHASE_HISTORY_STATE.PENDING) {
        throw new Error('Pending state is not allowed when the purchase already created.')
      }
      const updatedPurchase = await this.dependencies.repositoryGateway.updateOne({
        paymentIntentId: paymentIntentId,
      }, {
        paymentMethodId: paymentMethodId,
        state,
      })
      if (state === PURCHASE_HISTORY_STATE.COMPLETED) {
        // add user product
        await this.dependencies.createUserProductsService.createOne({
          productId: updatedPurchase.productId,
          userId: updatedPurchase.userId
        })
      }
      return updatedPurchase
    } catch (error) {
      console.log('failed to update purchase status:>> ', error.message);
      throw error
    }
  }
}