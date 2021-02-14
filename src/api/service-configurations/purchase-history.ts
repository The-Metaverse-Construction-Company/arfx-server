import PaymentGateway from '../../config/payment-gateway'
import {
  PurchaseProductService,
  PurchaseHistoryDetails,
  PurchaseHistoryList,
  UpdatePurchaseStateService,
  UpdatePurchasePaymentChargeService
} from '../domain/services/purchase-history'
import {
  productDetails
} from './products'
import {
  userDetails
} from './users'
import {
  createUserProductsService,
  userProductDetailsService
} from './user-products'

import {
  PurchaseHistoryRepository
} from '../../app-plugins/persistence/repository'

export const purchaseProductService = () => (
  new PurchaseProductService({
    repositoryGateway: new PurchaseHistoryRepository(),
    productDetailsService: productDetails(),
    userDetailsService: userDetails(),
    createUserProductsService: createUserProductsService(),
    userProductDetailsService: userProductDetailsService(),
    payment: {
      createIntent: PaymentGateway.paymentIntent.create,
      retrieveIntent: PaymentGateway.paymentIntent.retrieve,
      setupCustomerPaymentIntent: PaymentGateway.customer.setupIntents
    }
  })
)
export const updatePurchaseStateService = () => (
  new UpdatePurchaseStateService({
    repositoryGateway: new PurchaseHistoryRepository(),
    createUserProductsService: createUserProductsService()
  })
)
export const updatePurchasePaymentChargeService = () => (
  new UpdatePurchasePaymentChargeService({
    repositoryGateway: new PurchaseHistoryRepository()
  })
)
export const purchaseHistoryDetails = () => (
  new PurchaseHistoryDetails({
    repositoryGateway: new PurchaseHistoryRepository()
  })
)
export const purchaseHistoryList = () => (
  new PurchaseHistoryList({
    repositoryGateway: new PurchaseHistoryRepository()
  })
)