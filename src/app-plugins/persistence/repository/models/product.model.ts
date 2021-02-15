import {
  model, Document, Schema, SchemaTypeOpts, SchemaTypeOptions
} from 'mongoose'

import {
  IProductEntity
} from '../../../../api/domain/entities/product'
import { COLLECTION_NAMES } from '../constants/collection-names'

export const ProductBlobObject = {
  type: Object,
  originalFilepath: {
    type: String,
    default: ''
  },
  blobURL: {
    type: String,
    default: ''
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
    }
  },
  previewImage: ProductBlobObject,
  previewVideo: ProductBlobObject,
  thumbnail: ProductBlobObject,
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
const RepositoryModel = <Record<keyof IProductEntity, SchemaTypeOpts<any>>> {
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
export default model<IProductRepository>(COLLECTION_NAMES.PRODUCT, RepositorySchema)
