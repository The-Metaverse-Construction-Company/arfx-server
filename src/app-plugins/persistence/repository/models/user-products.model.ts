import {
  model, Document, Schema, SchemaTypeOpts
} from 'mongoose'

import {
  IUserProductsEntity
} from '../../../../api/domain/entities/user-products'
import { COLLECTION_NAMES } from '../constants/collection-names'
import {ProductBlobObject} from './product.model'
export interface IUserProductsRepositoryModel extends Document, IUserProductsEntity {
  _id: any
}
// this will automatically error when it have a changes on the purchase history entity interface
const RepositoryModel = <Record<keyof IUserProductsEntity, SchemaTypeOpts<Object>>> {
  _id: {
    type: String,
    default: '',
  },
  // name: {
  //   type: String,
  //   default: '',
  //   required: true,
  // },
  // title: {
  //   type: String,
  //   default: '',
  //   required: true,
  // },
  // contentZip: ProductBlobObject,
  // previewImage: ProductBlobObject,
  // previewVideo: ProductBlobObject,
  // description: {
  //   type: String,
  //   default: '',
  //   required: true,
  // },
  productId: {
    type: String,
    default: '',
    required: true,
    ref: COLLECTION_NAMES.PRODUCT
  },
  userId: {
    type: String,
    default: '',
    required: true,
    ref: COLLECTION_NAMES.USER
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
export default model<IUserProductsRepositoryModel>(COLLECTION_NAMES.USER_PRODUCT, RepositorySchema)
