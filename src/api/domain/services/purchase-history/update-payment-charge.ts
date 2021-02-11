import {
  IPurchaseHistorryRepositoryGateway
} from '../../entities/purchase-history'
import { IGeneralServiceDependencies } from '../../interfaces';
interface IDependencies extends IGeneralServiceDependencies<IPurchaseHistorryRepositoryGateway> {
}
export class UpdatePurchasePaymentChargeService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * update the state of the puchase.
   * @param paymentIntentId // paymentMethodId from the payment gateway.
   * @param paymentMethodId // payment charge id from the payment gateway.
   * @param paymentChargeId // payment charge id from the payment gateway.
   */
  public updateOne = async (paymentIntentId: string, paymentMethodId: string, paymentChargeId: string) => {
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