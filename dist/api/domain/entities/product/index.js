"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./interfaces"), exports);
__exportStar(require("./RepositoryGatewayInterfaces"), exports);
exports.default = ({ generateId }) => (class ProductEntity {
    constructor({ _id = '', name = '', description = '', price = 0, sceneURL = '', title = '', published = false, 
    // stripeCustomerId = '',
    updatedAt = Date.now(), createdAt = Date.now() }) {
        this.published = false;
        if (!_id) {
            _id = generateId();
        }
        // add additional business rules here if needed.
        this._id = _id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.sceneURL = sceneURL;
        this.title = title;
        this.published = published;
        // this.stripeCustomerId = stripeCustomerId
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
    }
});
