
import {
  IPurchaseHistorryRepositoryGateway,
  IPurchaseHistoryEntity
} from '../../../api/domain/entities/purchase-history'
import {
  default as PurchaseHistoryRepositoryModel,
  IPurchaseHistoryRepository
} from './models/purchase-history.model'

import GeneralRepository from './General.Gateway'

export class PurchaseHistoryRepository extends GeneralRepository<IPurchaseHistoryEntity, IPurchaseHistoryRepository> implements IPurchaseHistorryRepositoryGateway {
  constructor () {
    super(PurchaseHistoryRepositoryModel)
  }
}