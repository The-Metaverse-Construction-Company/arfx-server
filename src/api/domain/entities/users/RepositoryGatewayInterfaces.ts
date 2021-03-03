import {
  IGeneralRepositoryGateway,
  IRespositoryGatewayEntityFields,
  IPaginationQueryParams, IAggregatePaginationResponse
} from '../../interfaces/general-repository-gateway'
import {
  IUserEntity
} from './interfaces'
export interface IValidateUserEmailOption {
  userId?: string // user id to be ignored on the query.
}
export interface IUserRepositoryGateway extends IGeneralRepositoryGateway<IUserEntity> {
  paginationList(queryParams: IPaginationQueryParams, projection?: IRespositoryGatewayEntityFields<IUserEntity>): Promise<IAggregatePaginationResponse<IUserEntity>>
  getOneByAzureAdId(uid: string): Promise<null|IUserEntity>
  validateEmail(email: string, option?: IValidateUserEmailOption): Promise<null|IUserEntity>
}