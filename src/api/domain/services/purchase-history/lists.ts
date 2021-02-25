import {
  IPurchaseHistorryRepositoryGateway, IPurchaseHistoryPaginationListParams
} from '../../entities/purchase-history'
import { IGeneralServiceDependencies } from '../../interfaces';
import { IPaginationParameters } from '../../interfaces/general-repository-gateway';
interface IDependencies extends IGeneralServiceDependencies<IPurchaseHistorryRepositoryGateway> {}
export class PurchaseHistoryList {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * get list 
   * @param userId 
   * @param queryParams 
   */
  public getList = async (queryParams: IPurchaseHistoryPaginationListParams) => {
    try {
      // get list in the repo
      const purchaseHistoryList = await this.dependencies.repositoryGateway.getPaginationList(queryParams)
      return purchaseHistoryList
    } catch (error) {
      console.log('failed to create product. \nError :>> ', error);
      throw error
    }
  }
}