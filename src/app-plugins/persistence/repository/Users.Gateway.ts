
import {
  IUserEntity,
  IUserRepositoryGateway
} from '../../../api/domain/entities/users'
import {
  default as UserRepositoryModel,
  IUserRepository
} from './models/users'

import GeneralRepository from './General.Gateway'
import { IPaginationQueryParams } from '../../../api/domain/interfaces/general-repository-gateway'
import { generateSearchTextFields } from '../../../api/helper/repository'

export class UserRepository extends GeneralRepository<IUserRepository, IUserEntity> implements IUserRepositoryGateway {
  constructor () {
    super(UserRepositoryModel)
  }

  public paginationList = async (filterQuery: IPaginationQueryParams, projection:any = {}) => {
    try {
      const paginationList = await this.aggregateWithPagination([
        {
          $project: {
            ...projection,
            password: 0
          }
        },
        {
          $sort: {
            createdAt: 1
          }
        },
      ], {
        ...filterQuery,
      })
      return paginationList
    } catch (error) {
      throw error
    }
  }
}