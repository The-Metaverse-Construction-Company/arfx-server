"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseHistoryEntity = exports.ProductEntity = exports.UserEntity = void 0;
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users_1 = __importDefault(require("./users"));
const product_1 = __importDefault(require("./product"));
const purchase_history_1 = __importDefault(require("./purchase-history"));
exports.UserEntity = users_1.default({ generateId: uuid_1.v4, hash: (pwd) => {
        const hashPassword = bcryptjs_1.default.hashSync(pwd, 10);
        return hashPassword;
    } });
exports.ProductEntity = product_1.default({ generateId: uuid_1.v4 });
exports.PurchaseHistoryEntity = purchase_history_1.default({ generateId: uuid_1.v4 });
