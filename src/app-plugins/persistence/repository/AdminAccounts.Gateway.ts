
import {
  IAdminAccountRepositoryGateway,
  IAdminAccountsEntity
} from '../../../api/domain/entities/admin-accounts'
import {
  default as AdminAccountsRepositoryModel,
  IAdminAccountsRepositoryModel
} from './models/admin-accounts.model'

import GeneralRepository from './General.Gateway'

export class AdminAccountRepository extends GeneralRepository<IAdminAccountsEntity, IAdminAccountsRepositoryModel> implements IAdminAccountRepositoryGateway {
  constructor () {
    super(AdminAccountsRepositoryModel)
  }
}