/**
 * @lib
 */
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
import sinon from 'sinon'
/**
 * @admin_tester
 */
import './admin/index.test'
/**
 * @user_tester
 */
import './users/index.test'
before((done) => {
  // overwrite the logger function
  console.log = () => ({})
  sinon
    .stub(PaymentGateway.paymentIntent, 'create')
    .resolves({authenticated: false, paymentIntent: <any>{_id: 'cus_IuC9hvua5AC5gL'}})
  sinon
    .stub(PaymentGateway.customer, 'create')
    .resolves(`cus_IuC9hvua5AC5gL`)
  sinon
    .stub(PaymentGateway.customer.paymentMethod, 'list')
    .resolves([] as any)
  sinon
    .stub(PaymentGateway.customer, 'setupIntents')
    .resolves({} as any)
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