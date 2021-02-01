
import {
  IFeaturedProductEntity,
  IFeaturedProductRepositoryGateway
} from '../../../api/domain/entities/featured-product'
import {
  default as FeaturedProductRepositoryModel,
  IFeaturedProductRepositoryModel
} from './models/product-banner.model'

import GeneralRepository from './General.Gateway'
import { IPaginationParameters } from '../../../api/domain/interfaces/general-repository-gateway'
import { COLLECTION_NAMES } from './constants/collection-names'

export class FeaturedProductRepository extends GeneralRepository<IFeaturedProductEntity, IFeaturedProductRepositoryModel> implements IFeaturedProductRepositoryGateway {
  constructor () {
    super(FeaturedProductRepositoryModel)
  }

  public getPaginationList = (filterQuery: IPaginationParameters) => {
    try {
      const response = this.aggregateWithPagination([
        {
          $match: {}
        }, 
        {
          $lookup: {
            from : COLLECTION_NAMES.PRODUCT,
            let: {
              prodId: 'productId'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$$prodId', '_id']
                  }
                }
              },
              {
                $sort: {
                  _id: 1
                }
              }
            ]
          }
        },
        {
          $sort: {
            indexNo: 1
          }
        }
      ], {
        ...filterQuery
      })
      return response
    } catch (error) {
      throw error
    }
  }
}