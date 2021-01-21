import {
  IPurchaseHistoryBody,
  IPurchaseHistorryRepositoryGateway
} from '../../entities/purchase-history'
import {
  PurchaseHistoryEntity
} from '../../entities'
import { IGeneralServiceDependencies } from '../../interfaces';

interface IDependencies extends IGeneralServiceDependencies<IPurchaseHistorryRepositoryGateway> {}
export class CreatePurchaseHistory {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * create purchase history
   * @param productBody 
   */
  public createOne (purchaseBody: IPurchaseHistoryBody) {
    try {
      const newProductEntity = new PurchaseHistoryEntity(purchaseBody)
      // insert it thru the repo.
      // this.dependencies.repositoryGateway.insertOne(newProductEntity)
      // add logs
      return newProductEntity
    } catch (error) {
      console.log('failed to create product. \nError :>> ', error);
      throw error
    }
  }
}