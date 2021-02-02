
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

export class UserRepository extends GeneralRepository<IUserEntity, IUserRepository> implements IUserRepositoryGateway {
  constructor () {
    super(UserRepositoryModel)
  }

  // public paginationList = async (query: IPaginationQueryParams, projection: any = {}) => {
  //   try {
  //     const {
  //       limit = 10,
  //       pageNo = 1,
  //       searchText
  //     } = query
  //     const searchFields = generateSearchTextFields<IUserEntity>([''], searchText)
  //     const userList = await UserRepositoryModel.find(query, {...projection, password: 0})
  //     .sort({ createdAt: -1 })
  //     .skip(limit * (pageNo - 1))
  //     .limit(limit)
  //     .exec();
  //   } catch (error) {
  //     throw error
  //   }
  // }
}