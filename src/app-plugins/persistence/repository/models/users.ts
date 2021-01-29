import {
  model, Document, Schema, SchemaTypeOpts
} from 'mongoose'

import {
  IUserEntity
} from '../../../../api/domain/entities/users'
import { COLLECTION_NAMES } from '../constants/collection-names'

export interface IUserRepository extends Document, IUserEntity {
  _id: any
}
// this will automatically error when it have a changes on the purchase history entity interface
const RepositoryModel = <Record<keyof IUserEntity, SchemaTypeOpts<Object>>> {
  _id: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  email: {
    value: {
      type: String,
      default: '',
      required: true
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
  mobileNumber: {
    value: {
      type: String,
      default: '',
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
  stripeCustomerId: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    default: '',
    required: true
  },
  role: {
    type: String,
    default: '',
    required: true
  },
  service: {
    facebook: {
      type: String,
      default: '',
    },
    google: {
      type: String,
      default: '',
    },
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
export default model<IUserRepository>(COLLECTION_NAMES.USER, RepositorySchema)