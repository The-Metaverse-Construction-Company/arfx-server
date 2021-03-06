import PaymentGateway from '../../config/payment-gateway'
import {
  PurchaseProductService,
  PurchaseHistoryDetailsService,
  PurchaseHistoryListService,
  UpdatePurchaseStateService,
  UpdatePurchasePaymentChargeService
} from '../domain/services/purchase-history'
import {
  productDetailService,
  updateProductPurchaseCountService
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
    productDetailsService: productDetailService(),
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
    createUserProductsService: createUserProductsService(),
    updateProductPurchaseCountService: updateProductPurchaseCountService()
  })
)
export const updatePurchasePaymentChargeService = () => (
  new UpdatePurchasePaymentChargeService({
    repositoryGateway: new PurchaseHistoryRepository()
  })
)
export const purchaseHistoryDetails = () => (
  new PurchaseHistoryDetailsService({
    repositoryGateway: new PurchaseHistoryRepository()
  })
)
export const purchaseHistoryList = () => (
  new PurchaseHistoryListService({
    repositoryGateway: new PurchaseHistoryRepository()
  })
)