import {
  IFeaturedProductParams,
  IFeaturedProductRepositoryGateway
} from '../../entities/featured-product'
import {
  FeaturedProductEntity
} from '../../entities'
import {
  IGeneralServiceDependencies
} from '../../interfaces'
interface IServiceDependencies extends IGeneralServiceDependencies<IFeaturedProductRepositoryGateway>{
}
export class CreateFeaturedProductService {
  constructor (protected deps: IServiceDependencies) {
  }
  public createOne = async (data: IFeaturedProductParams) => {
    try {
      const {
        active = true,
        adminAccountId = '',
        productId = ''
      } = data
      const newFeaturedProduct = new FeaturedProductEntity({
        active,
        adminAccountId,
        productId
      })
      // insert product banner on the repository
      const featuredProduct = await this.deps.repositoryGateway.insertOne(newFeaturedProduct)
      //add some logs
      return newFeaturedProduct
    } catch (error) {
      console.log('failed to create product banner. \nError:>> ', error);
      throw error
    }
  }
}