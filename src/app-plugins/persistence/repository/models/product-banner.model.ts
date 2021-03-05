import {
  model, Document, Schema, SchemaTypeOpts
} from 'mongoose'

import {
  IFeaturedProductEntity
} from '../../../../api/domain/entities/featured-product'
import { COLLECTION_NAMES } from '../constants/collection-names'

export interface IFeaturedProductRepositoryModel extends Document, IFeaturedProductEntity {
  _id: any
}
// this will automatically error when it have a changes on the purchase history entity interface
const RepositoryModel = <Record<keyof IFeaturedProductEntity, SchemaTypeOpts<Object>>> {
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


RepositorySchema.index({
  createdAt: -1
})
export default model<IFeaturedProductRepositoryModel>(COLLECTION_NAMES.FEATURED_PRODUCT, RepositorySchema)