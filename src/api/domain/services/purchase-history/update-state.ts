/**
 * @entity_interfaces
 */
import {
  IPurchaseHistorryRepositoryGateway, PURCHASE_HISTORY_STATE
} from '../../entities/purchase-history'
/**
 * @general_interfaces
 */
import { IGeneralServiceDependencies } from '../../interfaces';
/**
 * @services
 */
import { UpdateProductPurchaseCountService } from '../products';
import { CreateUserProductsService } from '../user-products';
interface IServiceDependencies extends IGeneralServiceDependencies<IPurchaseHistorryRepositoryGateway> {
  createUserProductsService: CreateUserProductsService
  updateProductPurchaseCountService: UpdateProductPurchaseCountService
}
export class UpdatePurchaseStateService {
  constructor(protected dependencies: IServiceDependencies) {
  }
  /**
   * update the state of the puchase.
   * @param paymentIntentId // paymentMethodId from the payment gateway.
   * @param paymentMethodId // payment charge id from the payment gateway.
   * @param state PURCHASE_HISTORY_STATE
   *  - 1: COMPLETED
   *  - 2: PENDING
   *  - 3: CANCELLED
   *  - 4: FAILED
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
        // update the purchase count of the product.
        await this.dependencies.updateProductPurchaseCountService.updateOne(updatedPurchase.productId)
      }
      return updatedPurchase
    } catch (error) {
      console.log('failed to update purchase status:>> ', error.message);
      throw error
    }
  }
}