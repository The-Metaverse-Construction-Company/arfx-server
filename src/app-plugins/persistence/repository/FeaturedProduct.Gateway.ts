
import {
  IFeaturedProductEntity,
  IFeaturedProductRepositoryGateway,
  IFeaturedProductsParams
} from '../../../api/domain/entities/featured-product'
import {
  default as FeaturedProductRepositoryModel,
  IFeaturedProductRepositoryModel
} from './models/product-banner.model'

import GeneralRepository from './General.Gateway'
import { COLLECTION_NAMES } from './constants/collection-names'

export class FeaturedProductRepository extends GeneralRepository<IFeaturedProductRepositoryModel, IFeaturedProductEntity> implements IFeaturedProductRepositoryGateway {
  constructor () {
    super(FeaturedProductRepositoryModel)
  }

  public getPaginationList = (filterQuery: IFeaturedProductsParams) => {
    const {userId = ''} = filterQuery
    try {
      const response = this.aggregateWithPagination([
        {
          $match: {
            active: true
          }
        }, 
        {
          $lookup: {
            from : COLLECTION_NAMES.PRODUCT,
            localField: "productId",
            foreignField: "_id",
            // let: {
            //   prodId: '$productId'
            // },
            // pipeline: [
            //   {
            //     $match: {
            //       $expr: {
            //         $eq: ['$$prodId', '$_id']
            //       }
            //     }
            //   },
            //   {
            //     $project: {
            //       contentZip: 0,
            //       'previewImage.originalFilepath': 0,
            //       'previewVideo.originalFilepath': 0,
            //       'thumbnail.originalFilepath': 0,
            //     }
            //   },
            //   {
            //     $sort: {
            //       _id: 1
            //     }
            //   }
            // ],
            as: "products"
          }
        },
        {
          $unwind: {
            preserveNullAndEmptyArrays: false,
            path: "$products"
          }
        },
        {
          $project: {
            "products.contentZip.originalFilepath": 0,
            "products.previewImage.originalFilepath": 0,
            "products.previewVideo.originalFilepath": 0,
            "products.thumbnail.originalFilepath": 0,
          }
        },
        {
          $sort: {
            indexNo: 1
          }
        },
        {
          $lookup: {
            from: COLLECTION_NAMES.USER_PRODUCT,
            localField: "productId",
            foreignField: "productId",
            // let: {
            //   prodId: '$productId'
            // },
            // pipeline: [
            //   {
            //     $match: {
            //       // filter user products loggedIn user
            //       $and: [
            //         {
            //           userId: userId
            //         },
            //         {
            //           $or: [
            //             {
            //               userId: {
            //                 $ne: ''
            //               }
            //             },
            //             {
            //               userId: {
            //                 $ne: null
            //               }
            //             }
            //           ]
            //         },
            //       ]
            //     }
            //   },
            //   {
            //     $match: {
            //       $expr: {
            //         $eq: ['$$prodId', '$productId']
            //       }
            //     }
            //   },
            //   {
            //     $project: {
            //       _id: 0,
            //       userId: 1
            //     }
            //   }
            // ],
            as: 'userProduct'
          }
        },
        {
          $unwind: {
            preserveNullAndEmptyArrays: true,
            path: '$userProduct',

          }
        },
        {
          $group: {
            _id: "$_id",
            root: {
              $first: {
                $mergeObjects: ["$$ROOT", {
                  userId: {
                   $ifNull: ["$userProduct.userId", '']
                  }
                }]
              }
            }
          }
        },
        {
          $replaceRoot:{
            newRoot: "$root"
          }
        },
        {
          $addFields: {
            hasOwned: {
              $cond: [{$ne: ['$userId', '']}, true, false]
            },
          }
        },
        {
          $project: {
            userProduct: 0,
            userId: 0
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