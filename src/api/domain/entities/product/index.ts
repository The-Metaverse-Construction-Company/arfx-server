import {
  IProductBlobProperties,
  IProductEntity
} from './interfaces'
import {
  IGeneralEntityDependencies
} from '../../interfaces/index'

export * from './constants'
export * from './interfaces'
export * from './RepositoryGatewayInterfaces'

interface Dependencies extends IGeneralEntityDependencies {
  
}
export default ({
  generateId
}: Dependencies) => (
  class ProductEntity implements IProductEntity {
    public readonly _id!: string
    public readonly name!: string
    public readonly title!: string
    public readonly description!: string
    public readonly published: boolean = true
    // public readonly stripeCustomerId!: string
    public readonly price!: number
    public readonly adminAccountId!: string
    public readonly purchaseCount!: number
    public readonly discountPercentage!: number
    public contentZip!: IProductBlobProperties
    public previewVideo!: IProductBlobProperties
    public previewImage!: IProductBlobProperties
    public readonly createdAt!: number
    public readonly updatedAt!: number
    constructor ({
      _id = '',
      name = '',
      description = '',
      price = 0,
      discountPercentage = 0,
      adminAccountId = '',
      purchaseCount = 0,
      contentZip = {blobURL: '', originalFilepath: ''},
      previewVideo = {blobURL: '', originalFilepath: ''},
      previewImage = {blobURL: '', originalFilepath: ''},
      title = '',
      published = true,
      // stripeCustomerId = '',
      updatedAt = Date.now(),
      createdAt  = Date.now()
    }: Partial<IProductEntity>) {
      
      price = parseFloat(<any>price)
      discountPercentage = parseFloat(<any>discountPercentage)
      if (!_id) {
        _id = generateId()
      }
      if (price <= 0) {
        throw new Error('Price must be larger than 0.')
      }
      if (discountPercentage < 0) {
        throw new Error('discountPercentage must be larger than 0.')
      }
      if (!title) {
        throw new Error('title must not be null, undefined or empty string.')
      } else if (title.length < 3) {
        throw new Error('title must atleast 3 characters.')
      }
      if (!description) {
        throw new Error('description must not be null, undefined or empty string.')
      }
      // add additional business rules here if needed.
      this._id = _id
      this.name = name
      this.description = description
      this.price = price
      this.discountPercentage = discountPercentage
      this.contentZip = contentZip
      this.previewVideo = previewVideo
      this.previewImage = previewImage
      this.adminAccountId = adminAccountId
      this.purchaseCount = purchaseCount
      this.title = title
      this.published = published
      // this.stripeCustomerId = stripeCustomerId
      this.updatedAt = updatedAt
      this.createdAt = createdAt
    }
    
  }
)