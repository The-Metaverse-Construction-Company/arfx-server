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
export class UpdateFeaturedProductService {
  constructor (protected deps: IServiceDependencies) {
  }
  public updateOne = async (bannerId: string, data: IFeaturedProductParams) => {
    try {
      const {
        active = true,
        adminAccountId = '',
        productId = ''
      } = data
      const featuredProduct = new FeaturedProductEntity({
        _id: bannerId,
        active,
        adminAccountId,
        productId
      })
      // insert product banner on the repository
      const updatedFeaturedProduct = await this.deps.repositoryGateway.updateOne({
        _id: featuredProduct._id
      },
        {
          active: featuredProduct.active,
          productId: featuredProduct.productId
          // adminAccountId: featuredProduct.adminAccountId
        })
      //add some logs
      return featuredProduct
    } catch (error) {
      console.log('failed to update product banner. \nError:>> ', error);
      throw error
    }
  }
}