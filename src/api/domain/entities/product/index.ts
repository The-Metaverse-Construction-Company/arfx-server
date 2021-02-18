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
    if (!title) {
      throw new Error('title must not be null, undefined or empty string.')
    } else if (typeof(title) !== 'string') {
      throw new Error('title must be a string.')
    } else if (title.length < 3) {
      throw new Error('title must atleast 3 characters.')
    }
    if (!name) {
      throw new Error('name must not be null, undefined or empty string.')
    } else if (typeof(name) !== 'string') {
      throw new Error('name must be a string.')
    } else if (name.length < 3) {
      throw new Error('name must atleast 3 characters.')
    }
    if (!description) {
      throw new Error('description must not be null, undefined or empty string.')
    } else if (typeof(description) !== 'string') {
      throw new Error('description must be a string.')
    }
    if (price === null || price === undefined || isNaN(price)) {
      throw new Error('price must be a numeric with 2 decimal places.')
    } else {
      price = parseFloat(Number(price as any).toString())
      if (price <= 0) {
        throw new Error('price must be greater than 0.')
      }
    }
    if (discountPercentage === null || discountPercentage === undefined || isNaN(discountPercentage)) {
      throw new Error('discountPercentage must be a integer and a whole number.')
    } else {
      discountPercentage = parseInt(Number(discountPercentage as any).toString())
      if (discountPercentage < 0) {
        throw new Error('discountPercentage must be greater than 0.')
      }
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
      if (!_id) {
        _id = generateId()
      }
      if (!description) {
        throw new Error('description must not be null, undefined or empty string.')
      }
      if (typeof(published) !== 'boolean') {
        if (published === 0 || published === 1) {
          published = !!published
        } else if (published && (published === 'true' || published === 'false')) {
          published = JSON.parse(published)
        } else {
          throw new Error('published must be a boolean.')
        }
      }
      // add additional business rules here if needed.
      this._id = _id
      this.adminAccountId = adminAccountId
      this.purchaseCount = purchaseCount
      this.published = published
      this.updatedAt = updatedAt
      this.createdAt = createdAt
    }
    
  }
)