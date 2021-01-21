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
  public getList = async ({pageNo = 1, limit = 10, searchText = ''}: Partial<IPaginationParameters>) => {
    try {
      const query = {
        name: new RegExp(searchText, 'i'),
        "email.value": new RegExp(searchText, 'i')
      }
      const list = await this.dependencies.repositoryGateway.findAll(query, {pageNo, limit}, {
        password: 0
      })
      return list
    } catch (error) {
      console.log('error :>> ', error);
      throw error
    }
  }
}