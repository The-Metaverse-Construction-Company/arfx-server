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

import GeneralEntity from '../general'
import { PRODUCT_STATES, PRODUCT_UPLOAD_BLOB_STATES } from './constants'

export * from './constants'
export * from './interfaces'
export * from './RepositoryGatewayInterfaces'

interface Dependencies extends IGeneralEntityDependencies {
  
}
export const ProductCoreEntity = ({
  generateId
}: Dependencies) => (
  class ProductCoreEntity extends GeneralEntity({generateId}) implements IProductParams {
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
      price,
      _id,
      createdAt,
      updatedAt
    }: IProductParams & IProductBlob & Partial<Pick<IProductEntity, '_id' | 'createdAt' | 'updatedAt'>>) {
      super({_id, createdAt, updatedAt})
      if (!title) {
        throw new Error('title must not be null, undefined or empty string.')
      } else if (typeof(title) !== 'string') {
        throw new Error('title must be a string.')
      } else if (title.length < 3) {
        throw new Error('title must atleast 3 characters.')
      }
      if (this.validateString(name, 'name')) {
        if (name.length < 3) {
          throw new Error('name must atleast 3 characters.')
        }
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
)
export default ({
  generateId
}: Dependencies) => (
  class ProductEntity extends ProductCoreEntity({generateId}) implements IProductEntity  {
    public readonly _id!: string
    public readonly published: boolean = true
    // public readonly stripeCustomerId!: string
    public readonly price!: number
    public readonly adminAccountId!: string
    public readonly purchaseCount!: number
    public readonly discountPercentage!: number
    public readonly createdAt!: number
    public readonly updatedAt!: number
    public readonly state!: number
    public readonly deleted: boolean = false


    constructor ({
      _id = '',
      name = '',
      description = '',
      price = 0,
      discountPercentage = 0,
      adminAccountId = '',
      purchaseCount = 0,
      contentZip = {blobURL: '', originalFilepath: '', version: 0, hash: '', state: PRODUCT_UPLOAD_BLOB_STATES.PENDING},
      previewVideo = {blobURL: '', originalFilepath: '', state: PRODUCT_UPLOAD_BLOB_STATES.PENDING},
      previewImage = {blobURL: '', originalFilepath: '', state: PRODUCT_UPLOAD_BLOB_STATES.PENDING},
      thumbnail = {blobURL: '', originalFilepath: '', state: PRODUCT_UPLOAD_BLOB_STATES.PENDING},
      title = '',
      published = true,
      deleted = false,
      state = PRODUCT_STATES.PENDING,
      // stripeCustomerId = '',
      updatedAt = Date.now(),
      createdAt  = Date.now()
    }: Partial<IProductEntity>) {
      super({
        _id,
        createdAt,
        updatedAt,
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
      // add additional business rules here if needed.
      this.state = state
      this.adminAccountId = adminAccountId
      this.purchaseCount = purchaseCount
      this.published = this.validateBoolean(published, 'published')
      this.deleted = this.validateBoolean(deleted, 'deleted')
    }
    
  }
)