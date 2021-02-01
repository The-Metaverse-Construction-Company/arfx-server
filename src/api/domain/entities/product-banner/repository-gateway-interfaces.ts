import {
  IAggregatePaginationResponse,
  IGeneralRepositoryGateway, IPaginationParameters
} from '../../interfaces/general-repository-gateway'
import {
  IProductBannerEntity
} from './interfaces'

export interface IProductBannerRepositoryGateway extends IGeneralRepositoryGateway<IProductBannerEntity> {
  getPaginationList: (filterQuery: IPaginationParameters) => Promise<IAggregatePaginationResponse<IProductBannerEntity>>
}