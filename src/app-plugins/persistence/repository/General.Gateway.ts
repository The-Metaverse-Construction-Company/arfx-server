import {Model, Document} from 'mongoose'
import {v4 as uuid} from 'uuid'
import {
  IAggregatePagination,
  IPaginationQueryParams,
  IPaginationParameters
} from '../../../api/domain/interfaces/general-repository-gateway'
export default abstract class GeneralDBCommands<T, K> {
  // db instance
  protected collectionModel: Model<Document & T>
  /**
   * 
   * @param DB 
   */
  constructor (DB: Model<T & Document>) {
    this.collectionModel = DB
  }
  /**
   * find all data
   * @param queryParams 
   */
  public findAll (query?: Record<keyof K, any>, queryParams: IPaginationParameters = {}, projection = {}) {
    const {limit = 10, pageNo = 1} = queryParams
    return this.collectionModel.find(<any>query, projection)
      .skip(limit * (pageNo - 1))
      .limit(limit)
      .then((data) => {
        return data
      })
  }
  /**
   * by data by id
   * @param id 
   */
  public async findById (id: string) {
    try {
      const document = await this.collectionModel.findById(id)
      if (!document) {
        throw new Error('No document found.')
      }
      return document
    } catch (error) {
      throw error
    }
  }
  /**
   * by data by id
   * @param id 
   */
  public findOne (query: K, projection?: Partial<Record<keyof K, 0|1>>, toObject: boolean = true) {
    return this.collectionModel.findOne(query, projection)
      .then((data) => {
        if (!data) {
          throw new Error('No data found.')
        }
        return toObject ? <T>JSON.parse(JSON.stringify(data)) : <Document & T>data
      })
  }
  /**
   * insert data 
   * @param data 
   */
  public async insertOne (data: K) {
    const newDocument = await (this.initialize(data)).save()
    return newDocument.toObject()
  }
  /**
   * insert bulk/mutiple data 
   * @param data 
   */
  public insertMany (data: K[]) {
    return Promise.all(data.map((elem) => this.insertOne(elem)))
  }
  /**
   * initialize object
   * @param data 
   */
  public initialize (data: K) {
    return new this.collectionModel({
      _id: uuid(),
      createdAt: Date.now(),
      updatedat: 0,
      ...data
    })
  }
  /**
   * 
   * @param id 
   * @param data 
   */
  public async updateById (id: string, data: Partial<K>) {
    try {
      //@ts-expect-error
      delete data._id
      //@ts-expect-error
      delete data.id
      //@ts-expect-error
      delete data.createdAt
      const document = await this.findById(id)
      // if (document) {
        document.set(data)
        document.save()
      // }
      // return document
      return document.toObject()
    } catch (err) {
      throw err
    }
  }
  /**
   * update multiple/many documents
   * @param query 
   * @param data 
   */
  public updateMany(query: Record<keyof K, any>, data: K) {
    return this.collectionModel.updateMany(<any>query, <any>{
      $set: data
    })
    .then((result) => {
      return <T[]>result
    })
  }
  /**
   * update single document
   * @param query 
   * @param data 
   */
  public async updateOne(query: Record<keyof K, any>, data: K) {
    try {
      const document = <Document & T> await this.findOne(query, undefined, false)
      document.set(data)
      await document.save()
      return <T> JSON.parse(JSON.stringify(document))
    } catch (error) {
      throw error
    }
  }
  public removeById (id: string) {
    return this.findById(id)
      .then((document) => {
        if (document) {
          document.remove()
        }
        return document.toObject()
      })
  }
  public removeOne (query: Record<keyof K, any>) {
    return this.collectionModel.findOne(<any>query)
      .then((document) => {
        if (document) {
          document.remove()
        }
        return JSON.parse(JSON.stringify(document))
      })
  }
  /**
   * 
   * @param pipeline a pipeline query for aggregation on mongodb
   * @param queryParams for filtering, like limitTo, startAt, sortby etc..
   * @param searchFields2 array of fields that needed to be search or to filter,
   * a function that return a pagination data.
   */
  public aggregateWithPagination <SF extends keyof K>(pipeline: any[], queryParams: IPaginationQueryParams & {searchFields?: SF[]}): Promise<IAggregatePagination<K>> {
    let {limitTo = 0, startAt = 0, sortBy = null, searchFields = [], searchText = ''} = <any> queryParams || {}
    //@ts-ignore
    const endPage = parseInt(limitTo) >= 0 ? parseInt(limitTo) : 20
    //@ts-ignore
    const startPage = parseInt(startAt) > 0 ? parseInt(startAt) : 0
    //@ts-ignore
    var sortTo = {createdAt: -1}
    if (sortBy) {
      sortTo = Array.isArray(sortBy) ? sortBy.reduce((obj, s) => {
        obj[s.fieldName] = parseInt(s.status)
        return obj
      }, {}) : {[sortBy.fieldName]: sortBy.status}
    }
    const firstPipeline = <any[]>[
      {
        $sort: sortTo
      },
      {
        $skip: startPage
      },
      {
        $limit: endPage
      }
    ]
    // if limitTO is equal to = 0, will remove the $limit on the pipeline
    if (endPage === 0) {
      const ind = firstPipeline.findIndex((stage) => Object.keys(stage)[0] === '$limit')
      if (ind >= 0) {
        // remove ethe $limit on the pipeline.
        firstPipeline.splice(ind ,1)
      }
    }
    const q = (searchFields.length >= 1 ? searchFields : []).map((field: string) => ({[field]: {
      $regex: new RegExp(searchText, 'gi')
    }}))
    const paginationQuery = pipeline.concat([
      {
        $match: Object.assign(q.length >= 1 ? {
          $or: q
        } : {})
      },
      {
        $facet: {
          data: firstPipeline,
          totalPages: [
            {
              $group: {
                _id: null,
                counts: {
                  $sum: 1
                }
              }
            }
          ]
        }
      },
      {
        $unwind: {
          preserveNullAndEmptyArrays: false,
          path: '$totalPages'
        }
      },
      {
        $project: {
          _id: 0,
          data: 1,
          counts: '$totalPages.counts'
        }
    }])
    return this.collectionModel.aggregate(paginationQuery)
      .then((response: any) => {
        const paginationResponse = {data: [], total: 0, pages: 0, totalCounts: 0, totalPages: 0}
        if (response.length >= 1) {
          paginationResponse.data = response[0].data
          paginationResponse.pages = endPage >= 1 ? Math.ceil((response[0].counts / endPage)) : 1
          paginationResponse.total = response[0].counts
          //@ts-ignore
          paginationResponse.totalCounts = paginationResponse.total
          //@ts-ignore
          paginationResponse.totalPages = paginationResponse.pages
        }
        return paginationResponse
      })
  }
}