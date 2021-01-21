"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductPublishStatus = void 0;
class UpdateProductPublishStatus {
    constructor(dependencies) {
        this.dependencies = dependencies;
        /**
         * remove selected product
         * @param productBody
         */
        this.updateOne = async (productId, status = true) => {
            try {
                console.log('statusx :>> ', productId);
                console.log('statusx :>> ', status);
                // we can also update this to soft delete, or even move it thru archieve.
                const updateProduct = await this.dependencies.repositoryGateway.updateOne({
                    _id: productId
                }, {
                    published: status
                });
                // add logs here
                return updateProduct;
            }
            catch (error) {
                console.log('failed to create product. \nError :>> ', error);
                throw error;
            }
        };
    }
}
exports.UpdateProductPublishStatus = UpdateProductPublishStatus;
