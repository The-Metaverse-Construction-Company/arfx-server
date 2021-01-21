"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDetails = void 0;
class ProductDetails {
    constructor(dependencies) {
        this.dependencies = dependencies;
        /**
         * create new product.
         * @param productBody
         */
        this.findOne = async (productId) => {
            try {
                // get list in the repo
                const product = await this.dependencies.repositoryGateway.findOne({
                    _id: productId
                });
                return product;
            }
            catch (error) {
                console.log('failed to create product. \nError :>> ', error);
                throw error;
            }
        };
    }
}
exports.ProductDetails = ProductDetails;
