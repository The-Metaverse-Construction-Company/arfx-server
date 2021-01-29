import {
  IAggregatePaginationResponse,
  IGeneralRepositoryGateway,
  IPaginationParameters
} from '../../interfaces/general-repository-gateway'
import {
  IProductEntity
} from './interfaces'

export interface IProductRepositoryGateway extends IGeneralRepositoryGateway<IProductEntity> {
  getPaginationList: (userId: string, filterQuery: IPaginationParameters) => Promise<IAggregatePaginationResponse<IProductEntity>>
}