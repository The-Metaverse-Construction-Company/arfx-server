import {
  model, Document, Schema, SchemaTypeOpts
} from 'mongoose'

import {
  IProductBannerEntity
} from '../../../../api/domain/entities/product-banner'
import { COLLECTION_NAMES } from '../constants/collection-names'

export interface IProductBannerRepositoryModel extends Document, IProductBannerEntity {
  _id: any
}
// this will automatically error when it have a changes on the purchase history entity interface
const RepositoryModel = <Record<keyof IProductBannerEntity, SchemaTypeOpts<Object>>> {
  _id: {
    type: String,
    default: '',
  },
  adminAccountId: {
    type: String,
    default: '',
    required: true,
  },
  productId: {
    type: String,
    default: '',
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  indexNo: {
    type: Number,
    default: 0,
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
export default model<IProductBannerRepositoryModel>(COLLECTION_NAMES.PRODUCT_BANNER, RepositorySchema)