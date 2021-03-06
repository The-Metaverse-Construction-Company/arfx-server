import {
  model, Document, Schema, SchemaTypeOpts
} from 'mongoose'

import {
  IPurchaseHistoryEntity, PURCHASE_HISTORY_STATE
} from '../../../../api/domain/entities/purchase-history'
import { COLLECTION_NAMES } from '../constants/collection-names'
import {ProductBlobObject, ProductCoreRepositotyModelObj} from './product.model'
export interface IPurchaseHistoryRepository extends Document, IPurchaseHistoryEntity {
  _id: any
}
// this will automatically error when it have a changes on the purchase history entity interface
const RepositoryModel = <Record<keyof IPurchaseHistoryEntity, SchemaTypeOpts<Object>>> {
  _id: {
    type: String,
    default: '',
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
  paymentMethodId: {
    type: String,
    default: '',
    // required: true,
  },
  paymentIntentId: {
    type: String,
    default: '',
    // required: true,
  },
  paymentChargeId: {
    type: String,
    default: '',
  },
  amount: {
    type: Number,
    default: 0,
    required: true
  },
  state: {
    type: Number,
    default: PURCHASE_HISTORY_STATE.PENDING,
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
  ...ProductCoreRepositotyModelObj
}

const RepositorySchema = new Schema<IPurchaseHistoryRepository>(RepositoryModel)
RepositorySchema.index({
  createdAt: -1
})
export default model<IPurchaseHistoryRepository>(COLLECTION_NAMES.PURCHASE_HISTORY, RepositorySchema)
