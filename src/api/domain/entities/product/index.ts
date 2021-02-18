import {
  IProductBlob,
  IProductBlobProperties,
  IProductContentZip,
  IProductEntity,
  IProductParams
} from './interfaces'
import {
  IGeneralEntityDependencies
} from '../../interfaces/index'

export * from './constants'
export * from './interfaces'
export * from './RepositoryGatewayInterfaces'

interface Dependencies extends IGeneralEntityDependencies {
  
}
export class ProductCoreEntity implements IProductParams {
  public readonly name!: string
  public readonly title!: string
  public readonly description!: string
  public readonly discountPercentage: number
  public readonly price: number
  public contentZip!: IProductContentZip
  public previewVideo!: IProductBlobProperties
  public previewImage!: IProductBlobProperties
  public thumbnail!: IProductBlobProperties
  constructor ({
    name,
    title,
    description,
    contentZip,
    previewImage,
    thumbnail,
    previewVideo,
    discountPercentage,
    price
  }: IProductParams & IProductBlob) {
    if (price <= 0) {
      throw new Error('Price must be larger than 0.')
    }
    if (discountPercentage < 0) {
      throw new Error('discountPercentage must be larger than 0.')
    }
    this.name = name
    this.title = title
    this.description = description
    this.contentZip = contentZip
    this.previewImage = previewImage
    this.previewVideo = previewVideo
    this.thumbnail = thumbnail
    this.discountPercentage = discountPercentage
    this.price = price
  }
}
export default ({
  generateId
}: Dependencies) => (
  class ProductEntity extends ProductCoreEntity implements IProductEntity  {
    public readonly _id!: string
    public readonly published: boolean = true
    // public readonly stripeCustomerId!: string
    public readonly price!: number
    public readonly adminAccountId!: string
    public readonly purchaseCount!: number
    public readonly discountPercentage!: number
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
      contentZip = {blobURL: '', originalFilepath: '', version: 0, hash: ''},
      previewVideo = {blobURL: '', originalFilepath: ''},
      previewImage = {blobURL: '', originalFilepath: ''},
      thumbnail = {blobURL: '', originalFilepath: ''},
      title = '',
      published = true,
      // stripeCustomerId = '',
      updatedAt = Date.now(),
      createdAt  = Date.now()
    }: Partial<IProductEntity>) {
      super({
        title,
        name,
        description,
        contentZip,
        previewImage,
        previewVideo,
        thumbnail,
        discountPercentage,
        price
      })
      price = parseFloat(<any>price)
      discountPercentage = parseFloat(<any>discountPercentage)
      if (!_id) {
        _id = generateId()
      }
      if (!title) {
        throw new Error('title must not be null, undefined or empty string.')
      } else if (title.length < 3) {
        throw new Error('title must atleast 3 characters.')
      }
      if (!description) {
        throw new Error('description must not be null, undefined or empty string.')
      }
      if (published && typeof(published) === 'string' && (published === 'true' || published === 'false')) {
        published = JSON.parse(published)
      }
      // add additional business rules here if needed.
      this._id = _id
      this.price = price
      this.discountPercentage = discountPercentage
      this.adminAccountId = adminAccountId
      this.purchaseCount = purchaseCount
      this.published = published
      this.updatedAt = updatedAt
      this.createdAt = createdAt
    }
    
  }
)