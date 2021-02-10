import {
  model, Document, Schema, SchemaTypeOpts
} from 'mongoose'

import {
  IProductEntity
} from '../../../../api/domain/entities/product'
import { COLLECTION_NAMES } from '../constants/collection-names'

export const ProductBlobObject = {
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
// this will automatically error when it have a changes on the product entity interface
const RepositoryModel = <Record<keyof IProductEntity, SchemaTypeOpts<Object>>> {
  _id: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  contentZip: ProductBlobObject,
  previewImage: ProductBlobObject,
  previewVideo: ProductBlobObject,
  published: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    default: 0,
  },
  version: {
    type: Number,
    default: 0,
  },
  discountPercentage: {
    type: Number,
    default: 0,
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
}

const RepositorySchema = new Schema(RepositoryModel)
export default model<IProductRepository>(COLLECTION_NAMES.PRODUCT, RepositorySchema)
