import {
  IGeneralRepositoryGateway,
} from '../../interfaces/general-repository-gateway'
import {
  IAdminAccountsEntity
} from './interfaces'

export interface IAdminAccountRepositoryGateway extends IGeneralRepositoryGateway<IAdminAccountsEntity> {
}