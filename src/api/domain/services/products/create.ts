import {
  IProdutBody,
  IProductRepositoryGateway
} from '../../entities/product'
import {
  ProductEntity
} from '../../entities'
import { IGeneralServiceDependencies, IUploader } from '../../interfaces';

interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {
  fileUploader: IUploader
}
export class CreateProductService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * create new product.
   * @param productBody 
   *  - filepath: path of the file that uploaded on the server.
   */
  public createOne = async (productBody: IProdutBody & {filepath: string}, adminAccountId: string) => {
    try {
      const {filepath} = productBody
      const newProductEntity = new ProductEntity({
        ...productBody,
        adminAccountId: adminAccountId,
        contentURL: filepath
      })
      // upload to cloud storage provider
      await this.dependencies.fileUploader.upload(newProductEntity._id, filepath)
      // insert it thru the repo.
      await this.dependencies.repositoryGateway.insertOne(newProductEntity)
      // add logs
      return newProductEntity
    } catch (error) {
      console.log('failed to create product. \nError :>> ', error);
      throw error
    }
  }
}