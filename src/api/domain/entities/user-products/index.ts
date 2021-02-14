import {
  IUserProductsEntity
} from './interfaces'
import {
  IGeneralEntityDependencies
} from '../../interfaces/index'
import { IProductBlobProperties, ProductCoreEntity } from '../product'

export * from './interfaces'
export * from './repository-gateway-interfaces'

interface Dependencies extends IGeneralEntityDependencies {
}
export default ({
  generateId
}: Dependencies) => (
  class UserProductEntity implements IUserProductsEntity {
  // class UserProductEntity extends ProductCoreEntity implements IUserProductsEntity {
    public readonly _id!: string
    public readonly userId!: string
    public readonly productId!: string
    public readonly createdAt!: number
    public readonly updatedAt!: number
    constructor ({
      _id = '',
      // name = '',
      // description = '',
      // contentZip = {blobURL: '', originalFilepath: ''},
      // previewVideo = {blobURL: '', originalFilepath: ''},
      // previewImage = {blobURL: '', originalFilepath: ''},
      productId = '',
      userId = '',
      // title = '',
      // stripeCustomerId = '',
      updatedAt = Date.now(),
      createdAt  = Date.now()
    }: Partial<IUserProductsEntity>) {
      // super({
      //   title,
      //   name,
      //   description,
      //   contentZip,
      //   previewImage,
      //   previewVideo,
      // })
      if (!_id) {
        _id = generateId()
      }
      if (!productId) {
        throw new Error('productId must not be null, undefined or empty string.')
      }
      if (!userId) {
        throw new Error('userId must not be null, undefined or empty string.')
      }
      // add additional business rules here if needed.
      this._id = _id
      this.productId = productId
      this.userId = userId
      this.updatedAt = updatedAt
      this.createdAt = createdAt
    }
    
  }
)