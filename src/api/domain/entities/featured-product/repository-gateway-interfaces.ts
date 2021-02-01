import {
  IAggregatePaginationResponse,
  IGeneralRepositoryGateway, IPaginationParameters
} from '../../interfaces/general-repository-gateway'
import {
  IFeaturedProductEntity
} from './interfaces'

export interface IFeaturedProductRepositoryGateway extends IGeneralRepositoryGateway<IFeaturedProductEntity> {
  getPaginationList: (filterQuery: IPaginationParameters) => Promise<IAggregatePaginationResponse<IFeaturedProductEntity>>
}