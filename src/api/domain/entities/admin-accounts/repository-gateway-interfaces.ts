import {
  IAggregatePaginationResponse,
  IGeneralRepositoryGateway, IPaginationParameters,
} from '../../interfaces/general-repository-gateway'
import {
  IAdminAccountsEntity,
} from './interfaces'


export interface IAdminAccountRepositoryGateway extends IGeneralRepositoryGateway<IAdminAccountsEntity> {
  // validateEmail: (email: string, adminId: string) => Promise<Boolean>
  getPaginationList: (filterQuery: IPaginationParameters) => Promise<IAggregatePaginationResponse<IAdminAccountsEntity>>
}