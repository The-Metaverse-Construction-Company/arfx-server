"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductPublishStatus = exports.removeProduct = exports.productDetails = exports.productList = exports.updateProduct = exports.createProduct = void 0;
const products_1 = require("../domain/services/products");
const repository_1 = require("../../app-plugins/persistence/repository");
exports.createProduct = () => (new products_1.CreateProduct({
    repositoryGateway: new repository_1.ProductRepository()
}));
exports.updateProduct = () => (new products_1.UpdateProduct({
    repositoryGateway: new repository_1.ProductRepository()
}));
exports.productList = () => (new products_1.ProductList({
    repositoryGateway: new repository_1.ProductRepository()
}));
exports.productDetails = () => (new products_1.ProductDetails({
    repositoryGateway: new repository_1.ProductRepository()
}));
exports.removeProduct = () => (new products_1.RemoveProduct({
    repositoryGateway: new repository_1.ProductRepository()
}));
exports.updateProductPublishStatus = () => (new products_1.UpdateProductPublishStatus({
    repositoryGateway: new repository_1.ProductRepository()
}));
