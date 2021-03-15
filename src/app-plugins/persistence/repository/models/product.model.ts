import {
  model, Document, Schema, SchemaTypeOpts, SchemaTypeOptions
} from 'mongoose'

import {
  IProductEntity, PRODUCT_STATES, IProductBlobProperties, PRODUCT_UPLOAD_BLOB_STATES
} from '../../../../api/domain/entities/product'
import { COLLECTION_NAMES } from '../constants/collection-names'

export const ProductBlobObject = {
// export const ProductBlobObject = <Record<keyof IProductBlobProperties, SchemaTypeOpts<Object>>> {
  type: Object,
  originalFilepath: {
    type: String,
    default: ''
  },
  blobURL: {
    type: String,
    default: ''
  },
  state: {
    type: Number,
    default: PRODUCT_UPLOAD_BLOB_STATES.PENDING
  },
}
export interface IProductRepository extends Document, IProductEntity {
  _id: any
}
export const ProductCoreRepositotyModelObj = {
  name: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  contentZip: {
    ...ProductBlobObject,
    version: {
      type: Number,
      default: 0
    },
    hash: {
      type: Number,
      default: 0
    },
  },
  previewImage: ProductBlobObject,
  previewVideo: ProductBlobObject,
  thumbnail: ProductBlobObject,
  previewGif: ProductBlobObject,
  price: {
    type: Number,
    default: 0,
  },
  discountPercentage: {
    type: Number,
    default: 0,
  }
}
// this will automatically error when it have a changes on the product entity interface
const RepositoryModel = <Record<keyof IProductEntity, SchemaTypeOpts<Object>>> {
  _id: {
    type: String,
    default: '',
  },
  published: {
    type: Boolean,
    default: false
  },
  adminAccountId: {
    type: String,
    default: '',
    required: true
  },
  purchaseCount: {
    type: Number,
    default: 0
  },
  state: {
    type: Number,
    default: PRODUCT_STATES.PENDING
  },
  deleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Number,
    default: 0,
  },
  
  ...ProductCoreRepositotyModelObj
}

const RepositorySchema = new Schema(RepositoryModel)

RepositorySchema.index({
  createdAt: -1
})
export default model<IProductRepository>(COLLECTION_NAMES.PRODUCT, RepositorySchema)
