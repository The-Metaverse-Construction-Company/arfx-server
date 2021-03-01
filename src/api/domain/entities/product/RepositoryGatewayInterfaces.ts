import {
  IAggregatePaginationResponse,
  IGeneralRepositoryGateway,
  IPaginationParameters
} from '../../interfaces/general-repository-gateway'
import {
  IProductEntity
} from './interfaces'
export interface IProductListFilterQuery extends IPaginationParameters {
  userId?: string
  isAdmin?: boolean
  showDeleted?: boolean
  onFeaturedList?: boolean
}
export interface IProductRepositoryGateway extends IGeneralRepositoryGateway<IProductEntity> {
  getPaginationList: (userId: string, filterQuery: IPaginationParameters) => Promise<IAggregatePaginationResponse<IProductEntity>>
  getFeaturedList: (filterQuery: IProductListFilterQuery) => Promise<IProductEntity[]>
}