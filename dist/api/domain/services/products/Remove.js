"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveProduct = void 0;
class RemoveProduct {
    constructor(dependencies) {
        this.dependencies = dependencies;
        /**
         * remove selected product
         * @param productBody
         */
        this.removeOne = async (productId) => {
            try {
                // we can also update this to soft delete, or even move it thru archieve.
                const removedProduct = await this.dependencies.repositoryGateway.removeOne({
                    _id: productId
                });
                // add logs here
                return removedProduct;
            }
            catch (error) {
                console.log('failed to create product. \nError :>> ', error);
                throw error;
            }
        };
    }
}
exports.RemoveProduct = RemoveProduct;
