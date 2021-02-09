import {
  IAggregatePaginationResponse,
  IGeneralRepositoryGateway, IPaginationParameters
} from '../../interfaces/general-repository-gateway'
import {
  IUserProductsEntity
} from './interfaces'

export interface IUserProductsRepositoryGateway extends IGeneralRepositoryGateway<IUserProductsEntity> {
  getPaginationList: (userId: string, filterQuery: IPaginationParameters) => Promise<IAggregatePaginationResponse<IUserProductsEntity>>
}