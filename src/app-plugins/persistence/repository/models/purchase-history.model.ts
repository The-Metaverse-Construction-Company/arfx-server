import {
  model, Document, Schema, SchemaTypeOpts
} from 'mongoose'

import {
  IPurchaseHistoryEntity
} from '../../../../api/domain/entities/purchase-history'

export interface IPurchaseHistoryRepository extends Document, IPurchaseHistoryEntity {
  _id: any
}
const RepositoryModel = <Record<keyof IPurchaseHistoryEntity, SchemaTypeOpts<any>>> {
  _id: {
    type: String,
    default: '',
  },
  productId: {
    type: String,
    default: 0
  },
  paymentMethodId: {
    type: String,
    default: 0
  },
  amount: {
    type: Number,
    default: 0
  },
  discountPercentage: {
    type: String,
    default: 0
  },
  purchasedAt: {
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
export default model<IPurchaseHistoryRepository>('purchase_histories', RepositorySchema)