import {
  model, Document, Schema, SchemaTypeOpts
} from 'mongoose'

import {
  ADMIN_ROLE_LEVEL,
  IAdminAccountsEntity
} from '../../../../api/domain/entities/admin-accounts'
import { COLLECTION_NAMES } from '../constants/collection-names'

export interface IAdminAccountsRepositoryModel extends Document, IAdminAccountsEntity {
  _id: any
}
// this will automatically error when it have a changes on the purchase history entity interface
const RepositoryModel = <Record<keyof IAdminAccountsEntity, any>> {
// const RepositoryModel = <Record<keyof IAdminAccountsEntity, SchemaTypeOpts<Object>>> {
  _id: {
    type: String,
    default: '',
  },
  firstName: {
    type: String,
    default: '',
    required: true,
  },
  lastName: {
    type: String,
    default: '',
    required: true,
  },
  email: {
    value: {
      type: String,
      default: '',
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Number,
      default: 0
    }
  },
  password: {
    type: String,
    default: '',
    required: true,
  },
  roleLevel: {
    type: Number,
    default: ADMIN_ROLE_LEVEL.USER,
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
export default model<IAdminAccountsRepositoryModel>(COLLECTION_NAMES.ADMIN_ACCOUNT, RepositorySchema)
