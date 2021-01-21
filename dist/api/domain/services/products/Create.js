"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProduct = void 0;
const entities_1 = require("../../entities");
class CreateProduct {
    constructor(dependencies) {
        this.dependencies = dependencies;
    }
    /**
     * create new product.
     * @param productBody
     */
    createOne(productBody) {
        try {
            const newProductEntity = new entities_1.ProductEntity(productBody);
            // insert it thru the repo.
            this.dependencies.repositoryGateway.insertOne(newProductEntity);
            // add logs
            return newProductEntity;
        }
        catch (error) {
            console.log('failed to create product. \nError :>> ', error);
            throw error;
        }
    }
}
exports.CreateProduct = CreateProduct;
