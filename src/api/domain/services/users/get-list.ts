import {
  IUserRepositoryGateway
} from '../../entities/users'

import { IPaginationParameters } from '../../interfaces/general-repository-gateway'

import {
  IGeneralServiceDependencies
} from '../../interfaces'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{}
// interface IPaginationListParams {
//   page: number
//   perPage: number,
//   name: string
//   email: string
//   role: string
// }
export class UserListService {
  constructor (protected dependencies: IServiceDependencies) {
  }
  public getList = async (filterQuery: Partial<IPaginationParameters>) => {
    try {
      const response = await this.dependencies.repositoryGateway.paginationList(filterQuery)
      return response
    } catch (error) {
      console.log('error :>> ', error);
      throw error
    }
  }
}