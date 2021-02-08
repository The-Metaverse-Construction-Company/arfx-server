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
before(async (done) => {
  PaymentGateway.customer = {
    create: async () => uuid(),
    //@ts-expect-error
    charge: async () => ({}),
    //@ts-expect-error
    getPaymentMethods: async () => ({}),
    //@ts-expect-error
    setupIntents: async () => ({}),
  }
  // Promise.all([
  //   AdminAccountCollectionModel.remove({}),
  //   ProductBannerCollectionModel.remove({}),
  //   ProductCollectionModel.remove({}),
  //   PurchaseHistoryCollectionModel.remove({}),
  //   UserCollectionModel.remove({}),
  //   UserProductCollectionModel.remove({})
  // ])
  // .then(() => {
    done()
  // })
})
before(async (done) => {
  // await AdminAccountCollectionModel.remove({})
  // await ProductBannerCollectionModel.remove({})
  // await ProductCollectionModel.remove({})
  // await PurchaseHistoryCollectionModel.remove({})
  // await UserCollectionModel.remove({})
  // await UserProductCollectionModel.remove({})
  // console.log('Done testing');
  done()
})