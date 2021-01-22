"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../middlewares/auth");
const payment_card_route_1 = __importDefault(require("./payment-card.route"));
const router = express_1.default.Router({ mergeParams: true });
router.use('/payment-card', auth_1.authorize(auth_1.LOGGED_USER), payment_card_route_1.default);
exports.default = router;
