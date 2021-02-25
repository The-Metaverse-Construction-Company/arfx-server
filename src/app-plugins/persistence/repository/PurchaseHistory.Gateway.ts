
import {
  IPurchaseHistorryRepositoryGateway,
  IPurchaseHistoryEntity,
  IPurchaseHistoryPaginationListParams
} from '../../../api/domain/entities/purchase-history'
import {
  default as PurchaseHistoryRepositoryModel,
  IPurchaseHistoryRepository
} from './models/purchase-history.model'

import GeneralRepository from './General.Gateway'
import { IPaginationParameters, IAggregatePaginationResponse } from '../../../api/domain/interfaces/general-repository-gateway'

export class PurchaseHistoryRepository extends GeneralRepository<IPurchaseHistoryRepository, IPurchaseHistoryEntity> implements IPurchaseHistorryRepositoryGateway {
  constructor () {
    super(PurchaseHistoryRepositoryModel)
  }
  public async getPaginationList(filterQuery: IPurchaseHistoryPaginationListParams): Promise<IAggregatePaginationResponse<IPurchaseHistoryEntity>> {
    try {
      const {userId} = filterQuery
      const paginationList = await this.aggregateWithPagination([
        {
          $match: userId ? {
            userId
          } : {}
        },
        {
          $project: {
            contentZip: 0,
            "previewImage.originalFilepath": 0,
            "previewVideo.originalFilepath": 0,
            "thumbnail.originalFilepath": 0
          }
        }
      ], {
        ...filterQuery,
        searchFields: [
          'name',
          'title'
        ]
      })
      return paginationList
    } catch (error) {
      throw error
    }
  }
}