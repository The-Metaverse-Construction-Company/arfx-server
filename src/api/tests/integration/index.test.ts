/**
 * @lib
 */
import faker from 'faker'
import {v4 as uuid} from 'uuid'
/**
 * @repository_collections
 */
import {
  AdminAccountCollectionModel,
  ProductBannerCollectionModel,
  ProductCollectionModel,
  PurchaseHistoryCollectionModel,
  UserCollectionModel,
  UserProductCollectionModel
} from '../../../app-plugins/persistence/repository/models/index.model'
/**
 * @configs
 */
import PaymentGateway from '../../../config/payment-gateway'
import DB from '../../../config/mongoose'
/**
 * @admin_tester
 */
import './admin/index.test'
/**
 * @user_tester
 */
// import './users/sign-up.test'
// import './users/sign-in.test'
// import './users/products.test'
before((done) => {
  // overwrite the logger function
  console.log = () => ({})
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
    // UserCollectionModel.deleteMany({}),
    UserProductCollectionModel.deleteMany({})
  ])
  .then(() => {
    DB.close()
    done()
  })
})