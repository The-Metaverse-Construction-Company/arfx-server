import {
  IGeneralRepositoryGateway,
  IRespositoryGatewayEntityFields,
  IPaginationQueryParams, IAggregatePaginationResponse
} from '../../interfaces/general-repository-gateway'
import {
  IUserEntity
} from './interfaces'

export interface IUserRepositoryGateway extends IGeneralRepositoryGateway<IUserEntity> {
  paginationList(queryParams: IPaginationQueryParams, projection?: IRespositoryGatewayEntityFields<IUserEntity>): Promise<IAggregatePaginationResponse<IUserEntity>>
}