import {
  IAggregatePaginationResponse,
  IGeneralRepositoryGateway, IPaginationParameters
} from '../../interfaces/general-repository-gateway'
import {
  IPurchaseHistoryEntity
} from './interfaces'
export interface IPurchaseHistoryPaginationListParams extends IPaginationParameters {
  userId?: string
}
export interface IPurchaseHistorryRepositoryGateway extends IGeneralRepositoryGateway<IPurchaseHistoryEntity> {
  getPaginationList(filterQuery: IPurchaseHistoryPaginationListParams): Promise<IAggregatePaginationResponse<IPurchaseHistoryEntity>>
}