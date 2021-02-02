
import {
  IAdminAccountRepositoryGateway,
  IAdminAccountsEntity
} from '../../../api/domain/entities/admin-accounts'
import {
  default as AdminAccountsRepositoryModel,
  IAdminAccountsRepositoryModel
} from './models/admin-accounts.model'

import GeneralRepository from './General.Gateway'
import { IPaginationParameters } from '../../../api/domain/interfaces/general-repository-gateway'

export class AdminAccountRepository extends GeneralRepository<IAdminAccountsEntity, IAdminAccountsRepositoryModel> implements IAdminAccountRepositoryGateway {
  constructor () {
    super(AdminAccountsRepositoryModel)
  }

  public validateEmail = async (email:string, adminId: string) => {
    try {
      const query = <any>{
        'email.value': email
      }
      if (adminId) {
        query._id = {
          $ne: adminId
        }
      }
      const adminAccounts = await this.findOne({
        //@ts-expect-error
        'email.value': email
      }, {password: 0})
      // add catch to ignore the built in error on the findOne on repository gateway.
      .catch(() => null)
      if (adminAccounts) {
        throw new Error('email already exists.')
      }
      return true
    } catch (error) {
      throw error
    }
  }

  public getPaginationList = async (filterQuery: IPaginationParameters) => {
    try {
      const response = this.aggregateWithPagination([
        {
          $project: {
            password: 0
          }
        },
        {
          $addFields: {
            fullName: {
              $concat: ['$firstName', ' ', '$lastName']
            }
          }
        }
      ], {
        limit: filterQuery.limit,
        pageNo: filterQuery.pageNo,
        searchText: filterQuery.searchText,
        searchFields: [
          //@ts-expect-error
          'email.value', 'fullName'
        ]
      })
      return response
    } catch (error) {
      throw error
    }
  }
}