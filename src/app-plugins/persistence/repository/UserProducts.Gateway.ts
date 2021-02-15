
import {
  IUserProductsRepositoryGateway,
  IUserProductsEntity
} from '../../../api/domain/entities/user-products'
import {
  default as UserProductsRepositoryModel,
  IUserProductsRepositoryModel
} from './models/user-products.model'

import GeneralRepository from './General.Gateway'
import { IPaginationParameters, IAggregatePaginationResponse } from '../../../api/domain/interfaces/general-repository-gateway'
import { COLLECTION_NAMES } from './constants/collection-names'

export class UserProductRepository extends GeneralRepository<IUserProductsEntity, IUserProductsRepositoryModel> implements IUserProductsRepositoryGateway {
  constructor () {
    super(UserProductsRepositoryModel)
  }
  public getPaginationList = async (userId: string, filterQuery: IPaginationParameters) => {
    return this.aggregateWithPagination([
      {
        $match: {
          userId: userId
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $lookup: {
          from: COLLECTION_NAMES.PRODUCT,
          let: {
            prodId: '$productId'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$prodId', '$_id']
                }
              }
            },
            {
              $limit: 1
            },
            {
              $project: {
                title: 1,
                name: 1,
                description: 1,
                contentZip: {
                  blobURL: 1,
                },
                previewImage: {
                  blobURL: 1
                },
                previewVideo: {
                  blobURL: 1
                },
                thumbnail: {
                  blobURL: 1
                }
              }
            }
          ],
          as: "product"
        }
      },
      {
        $unwind: {
          preserveNullAndEmptyArrays: false,
          path: '$product'
        }
      },
      {
        $project: {
          userId: 1,
          productId: 1,
          title: "$product.title",
          name: "$product.name",
          description: "$product.description",
          contentZip: "$product.contentZip",
          previewImage: "$product.previewImage",
          previewVideo: "$product.previewVideo",
          createdAt: 1,
          updatedAt: 1,
        }
      }
    ], filterQuery)
  }
  /**
   * get user product details by userId
   * @param userId 
   * @param id either userProductId or productId
   */
  public getOneByUserId = async (userId: string, id: string) => {
    try {
      let responseData = null
      let userProductDetails = await this.collectionModel.findOne({
        userId,
        $or: [
          {
            _id: id
          },
          {
            productId: id
          },
        ]
      })
      .populate({
        path: 'productId',
        select: 'title name description contentZip previewImage previewVideo _id'
      })
      if (userProductDetails) {
        const _productDetails = userProductDetails.toJSON()
        responseData = {
          ..._productDetails,
          //@ts-expect-error
          ..._productDetails.productId,
          _id: _productDetails._id,
          productId: _productDetails.productId._id
        }
      }
      return responseData
    } catch (error) {
      throw error
    }
  }
}