/**
 * @entity_interfaces
 */
import {
  IPurchaseHistorryRepositoryGateway,
  IPurchaseHistoryPaginationListParams
} from '../../entities/purchase-history'
/**
 * @general_interfaces
 */
import { IGeneralServiceDependencies } from '../../interfaces';
interface IServiceDependencies extends IGeneralServiceDependencies<IPurchaseHistorryRepositoryGateway> {}
export class PurchaseHistoryListService {
  constructor(protected dependencies: IServiceDependencies) {
  }
  /**
   * get purchase history list.
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