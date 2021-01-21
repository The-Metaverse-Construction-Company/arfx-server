"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseHistoryRepository = void 0;
const purchase_history_model_1 = __importDefault(require("./models/purchase-history.model"));
const General_Gateway_1 = __importDefault(require("./General.Gateway"));
class PurchaseHistoryRepository extends General_Gateway_1.default {
    constructor() {
        super(purchase_history_model_1.default);
    }
}
exports.PurchaseHistoryRepository = PurchaseHistoryRepository;
