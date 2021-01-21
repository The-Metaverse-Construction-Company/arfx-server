"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProduct = void 0;
const entities_1 = require("../../entities");
class UpdateProduct {
    constructor(dependencies) {
        this.dependencies = dependencies;
        /**
         * create new product.
         * @param productBody
         */
        this.updateOne = async (productId, productBody) => {
            try {
                const newProductEntity = new entities_1.ProductEntity({
                    ...productBody,
                    _id: productId
                });
                const updatedProduct = await this.dependencies.repositoryGateway.updateOne({
                    _id: newProductEntity._id
                }, {
                    name: newProductEntity.name,
                    description: newProductEntity.description,
                    title: newProductEntity.title,
                    price: newProductEntity.price,
                    published: newProductEntity.published,
                    updatedAt: newProductEntity.updatedAt,
                });
                // insert it thru the repo.
                // add logs
                return updatedProduct;
            }
            catch (error) {
                console.log('failed to update product. \nError :>> ', error);
                throw error;
            }
        };
    }
}
exports.UpdateProduct = UpdateProduct;
