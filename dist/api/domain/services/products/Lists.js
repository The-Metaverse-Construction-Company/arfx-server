"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductList = void 0;
class ProductList {
    constructor(dependencies) {
        this.dependencies = dependencies;
        /**
         * create new product.
         * @param productBody
         */
        this.getList = async (queryParams) => {
            try {
                // get list in the repo
                const productList = await this.dependencies.repositoryGateway.findAll();
                return productList;
            }
            catch (error) {
                console.log('failed to create product. \nError :>> ', error);
                throw error;
            }
        };
    }
}
exports.ProductList = ProductList;
