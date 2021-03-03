
import {
  IUserEntity,
  IUserRepositoryGateway,
  IValidateUserEmailOption
} from '../../../api/domain/entities/users'
import {
  default as UserRepositoryModel,
  IUserRepository
} from './models/users.model'

import GeneralRepository from './General.Gateway'
import { IPaginationQueryParams } from '../../../api/domain/interfaces/general-repository-gateway'
import { generateSearchTextFields } from '../../../api/helper/repository'

export class UserRepository extends GeneralRepository<IUserRepository, IUserEntity> implements IUserRepositoryGateway {
  constructor () {
    super(UserRepositoryModel)
  }
  public async getOneByAzureAdId(uid: string): Promise<IUserEntity> {
    try {
      const query = <any>{
        $and: [
          {
            'service.azureAd': uid
          },
          {
            'service.azureAd': {
              $nin: ['', null, undefined]
            }
          }
        ]
      }
      const user = await this.findOne(query, {password: 0}).catch(() => null)
      return user
    } catch (error) {
      throw error
    }
  }
  public async validateEmail(email: string, option: IValidateUserEmailOption = {}): Promise<IUserEntity> {
    try {
      const {
        userId = ''
      } = option
      const query = <any>{
        'email.value': email
      }
      // ignore the provided userId on finding duplicate email.
      // most likely will use on update function
      if (userId) {
        query._id = {
          $ne: userId
        }
      }
      const user = await this.findOne(query, {password: 0}).catch(() => null)
      return user
    } catch (error) {
      throw error
    }
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