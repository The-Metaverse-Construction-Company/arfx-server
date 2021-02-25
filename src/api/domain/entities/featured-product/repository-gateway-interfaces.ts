import {
  IAggregatePaginationResponse,
  IGeneralRepositoryGateway,
  IPaginationParameters
} from '../../interfaces/general-repository-gateway'
import {
  IFeaturedProductEntity
} from './interfaces'

export interface IFeaturedProductsParams extends IPaginationParameters {
  userId?: string
}
export interface IFeaturedProductRepositoryGateway extends IGeneralRepositoryGateway<IFeaturedProductEntity> {
  getPaginationList: (filterQuery: IFeaturedProductsParams) => Promise<IAggregatePaginationResponse<IFeaturedProductEntity>>
}