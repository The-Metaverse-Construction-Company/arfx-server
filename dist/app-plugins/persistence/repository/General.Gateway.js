"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class GeneralDBCommands {
    /**
     *
     * @param DB
     */
    constructor(DB) {
        this.collectionModel = DB;
    }
    /**
     * find all data
     * @param queryParams
     */
    findAll(query, queryParams = {}, projection = {}) {
        const { limit = 10, pageNo = 1 } = queryParams;
        return this.collectionModel.find(query, projection)
            .skip(limit * (pageNo - 1))
            .limit(limit)
            .then((data) => {
            return data;
        });
    }
    /**
     * by data by id
     * @param id
     */
    async findById(id) {
        try {
            const document = await this.collectionModel.findById(id);
            if (!document) {
                throw new Error('No document found.');
            }
            return document;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * by data by id
     * @param id
     */
    findOne(query, projection, toObject = true) {
        return this.collectionModel.findOne(query, projection)
            .then((data) => {
            if (!data) {
                throw new Error('No data found.');
            }
            return toObject ? JSON.parse(JSON.stringify(data)) : data;
        });
    }
    /**
     * insert data
     * @param data
     */
    async insertOne(data) {
        const newDocument = await (this.initialize(data)).save();
        return newDocument.toObject();
    }
    /**
     * insert bulk/mutiple data
     * @param data
     */
    insertMany(data) {
        return Promise.all(data.map((elem) => this.insertOne(elem)));
    }
    /**
     * initialize object
     * @param data
     */
    initialize(data) {
        return new this.collectionModel({
            _id: uuid_1.v4(),
            createdAt: Date.now(),
            updatedat: 0,
            ...data
        });
    }
    /**
     *
     * @param id
     * @param data
     */
    async updateById(id, data) {
        try {
            //@ts-expect-error
            delete data._id;
            //@ts-expect-error
            delete data.id;
            //@ts-expect-error
            delete data.createdAt;
            const document = await this.findById(id);
            // if (document) {
            document.set(data);
            document.save();
            // }
            // return document
            return document.toObject();
        }
        catch (err) {
            throw err;
        }
    }
    /**
     * update multiple/many documents
     * @param query
     * @param data
     */
    updateMany(query, data) {
        return this.collectionModel.updateMany(query, {
            $set: data
        })
            .then((result) => {
            return result;
        });
    }
    /**
     * update single document
     * @param query
     * @param data
     */
    async updateOne(query, data) {
        try {
            const document = await this.findOne(query, undefined, false);
            document.set(data);
            await document.save();
            return JSON.parse(JSON.stringify(document));
        }
        catch (error) {
            throw error;
        }
    }
    removeById(id) {
        return this.findById(id)
            .then((document) => {
            if (document) {
                document.remove();
            }
            return document.toObject();
        });
    }
    removeOne(query) {
        return this.collectionModel.findOne(query)
            .then((document) => {
            if (document) {
                document.remove();
            }
            return JSON.parse(JSON.stringify(document));
        });
    }
    /**
     *
     * @param pipeline a pipeline query for aggregation on mongodb
     * @param queryParams for filtering, like limitTo, startAt, sortby etc..
     * @param searchFields2 array of fields that needed to be search or to filter,
     * a function that return a pagination data.
     */
    aggregateWithPagination(pipeline, queryParams) {
        let { limitTo = 0, startAt = 0, sortBy = null, searchFields = [], searchText = '' } = queryParams || {};
        //@ts-ignore
        const endPage = parseInt(limitTo) >= 0 ? parseInt(limitTo) : 20;
        //@ts-ignore
        const startPage = parseInt(startAt) > 0 ? parseInt(startAt) : 0;
        //@ts-ignore
        var sortTo = { createdAt: -1 };
        if (sortBy) {
            sortTo = Array.isArray(sortBy) ? sortBy.reduce((obj, s) => {
                obj[s.fieldName] = parseInt(s.status);
                return obj;
            }, {}) : { [sortBy.fieldName]: sortBy.status };
        }
        const firstPipeline = [
            {
                $sort: sortTo
            },
            {
                $skip: startPage
            },
            {
                $limit: endPage
            }
        ];
        // if limitTO is equal to = 0, will remove the $limit on the pipeline
        if (endPage === 0) {
            const ind = firstPipeline.findIndex((stage) => Object.keys(stage)[0] === '$limit');
            if (ind >= 0) {
                // remove ethe $limit on the pipeline.
                firstPipeline.splice(ind, 1);
            }
        }
        const q = (searchFields.length >= 1 ? searchFields : []).map((field) => ({ [field]: {
                $regex: new RegExp(searchText, 'gi')
            } }));
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
            }
        ]);
        return this.collectionModel.aggregate(paginationQuery)
            .then((response) => {
            const paginationResponse = { data: [], total: 0, pages: 0, totalCounts: 0, totalPages: 0 };
            if (response.length >= 1) {
                paginationResponse.data = response[0].data;
                paginationResponse.pages = endPage >= 1 ? Math.ceil((response[0].counts / endPage)) : 1;
                paginationResponse.total = response[0].counts;
                //@ts-ignore
                paginationResponse.totalCounts = paginationResponse.total;
                //@ts-ignore
                paginationResponse.totalPages = paginationResponse.pages;
            }
            return paginationResponse;
        });
    }
}
exports.default = GeneralDBCommands;
