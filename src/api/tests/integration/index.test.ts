import {
  AdminAccountCollectionModel,
  ProductBannerCollectionModel,
  ProductCollectionModel,
  PurchaseHistoryCollectionModel,
  UserCollectionModel,
  UserProductCollectionModel
} from '../../../app-plugins/persistence/repository/models/index.model'
import PaymentGateway from '../../../config/payment-gateway'
import faker from 'faker'
import {v4 as uuid} from 'uuid'
import DB from '../../../config/mongoose'
import './sign-up.test'
import './sign-in.test'
import './products.test'
before((done) => {
  // overwrite the logger function
  // console.log = () => ({})
  PaymentGateway.customer = {
    create: async () => uuid(),
    //@ts-expect-error
    charge: async () => ({}),
    //@ts-expect-error
    getPaymentMethods: async () => ({}),
    //@ts-expect-error
    setupIntents: async () => ({}),
  }
  done()
})
after((done) => {
   Promise.all([
    AdminAccountCollectionModel.deleteMany({}),
    ProductBannerCollectionModel.deleteMany({}),
    ProductCollectionModel.deleteMany({}),
    PurchaseHistoryCollectionModel.deleteMany({}),
    UserCollectionModel.deleteMany({}),
    UserProductCollectionModel.deleteMany({})
  ])
  .then(() => {
    DB.close()
    done()
  })
})