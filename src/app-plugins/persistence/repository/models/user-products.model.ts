import {
  model, Document, Schema, SchemaTypeOpts
} from 'mongoose'

import {
  IUserProductsEntity
} from '../../../../api/domain/entities/user-products'

export interface IUserProductsRepositoryModel extends Document, IUserProductsEntity {
  _id: any
}
// this will automatically error when it have a changes on the purchase history entity interface
const RepositoryModel = <Record<keyof IUserProductsEntity, SchemaTypeOpts<Object>>> {
  _id: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
    required: true,
  },
  title: {
    type: String,
    default: '',
    required: true,
  },
  productURL: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: '',
    required: true,
  },
  productId: {
    type: String,
    default: '',
    required: true,
  },
  userId: {
    type: String,
    default: '',
    required: true,
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
export default model<IUserProductsRepositoryModel>('user_products', RepositorySchema)