import {
  IFeaturedProductRepositoryGateway
} from '../../entities/featured-product'
import {
  IGeneralServiceDependencies
} from '../../interfaces'
import { IPaginationParameters } from '../../interfaces/general-repository-gateway'
interface IServiceDependencies extends IGeneralServiceDependencies<IFeaturedProductRepositoryGateway>{
}
export class FeaturedProductListService {
  constructor (protected deps: IServiceDependencies) {
  }
  public getList = async (filterQuery: IPaginationParameters) => {
    try {
      // remove the product banner on the repository.
      const paginationList = await this.deps.repositoryGateway.getPaginationList(filterQuery)
      //add some logs
      return paginationList
    } catch (error) {
      console.log('failed to remove product banner. \nError:>> ', error);
      throw error
    }
  }
}