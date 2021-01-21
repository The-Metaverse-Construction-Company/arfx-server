import {
  CreatePurchaseHistory,
  PurchaseHistoryDetails,
  PurchaseHistoryList
} from '../domain/services/purchase-history'

import {
  PurchaseHistoryRepository
} from '../../app-plugins/persistence/repository'

export const createPurchaseHistory = () => (
  new CreatePurchaseHistory({
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