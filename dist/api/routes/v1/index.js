"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("./user.route"));
const auth_route_1 = __importDefault(require("./auth.route"));
const reset_password_route_1 = __importDefault(require("./reset-password.route"));
const sign_up_route_1 = __importDefault(require("./sign-up.route"));
const products_route_1 = __importDefault(require("./products.route"));
const router = express_1.default.Router();
/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));
/**
 * GET v1/docs
 */
router.use('/docs', express_1.default.static('docs'));
/**
 *
 */
router.use('/users', user_route_1.default);
router.use('/products', products_route_1.default);
router.use('/auth', auth_route_1.default);
router.use('/auth/sign-up', sign_up_route_1.default);
router.use('/auth/reset-password', reset_password_route_1.default);
exports.default = router;
