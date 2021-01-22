import PaymentGateway from '../../config/payment-gateway'
import {
  PurchaseProductService,
  PurchaseHistoryDetails,
  PurchaseHistoryList,
} from '../domain/services/purchase-history'
import {
  productDetails
} from './Products'
import {
  userDetails
} from './users'

import {
  PurchaseHistoryRepository
} from '../../app-plugins/persistence/repository'

export const purchaseProductService = () => (
  new PurchaseProductService({
    repositoryGateway: new PurchaseHistoryRepository(),
    productDetailsService: productDetails(),
    userDetailsService: userDetails(),
    chargeCustomer: PaymentGateway.customer.charge,
    setupCustomerPaymentIntent: PaymentGateway.customer.setupIntents
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