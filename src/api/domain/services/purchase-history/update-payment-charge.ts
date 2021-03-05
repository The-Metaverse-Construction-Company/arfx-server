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
interface IServiceDependencies extends IGeneralServiceDependencies<IPurchaseHistorryRepositoryGateway> {
}
export class UpdatePurchasePaymentChargeService {
  constructor(protected dependencies: IServiceDependencies) {
  }
  /**
   * update the state of the puchase.
   * @param paymentIntentId // paymentMethodId from the payment gateway.
   * @param paymentChargeId // payment charge id from the payment gateway.
   */
  public updateOne = async (paymentIntentId: string, paymentChargeId: string) => {
    try {
      const updatedPurchase = await this.dependencies.repositoryGateway.updateOne({
        paymentIntentId: paymentIntentId,
      }, {
        paymentChargeId,
      })
      return updatedPurchase
    } catch (error) {
      console.log('failed to update purchase status:>> ', error.message);
      throw error
    }
  }
}