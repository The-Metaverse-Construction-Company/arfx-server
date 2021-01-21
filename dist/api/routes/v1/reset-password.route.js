"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validation_1 = __importDefault(require("express-validation"));
const controller = __importStar(require("../../controllers/reset-password.controller"));
const auth_validation_1 = require("../../validations/auth.validation");
const router = express_1.default.Router();
router.route('/')
    .post(express_validation_1.default(auth_validation_1.sendPasswordReset), controller.sendResetPasswordRoute)
    .get(express_validation_1.default(auth_validation_1.verifyResetPasswordToken), controller.verifyResetPasswordMiddleWare, controller.verifyResetPasswordRoute)
    .patch(express_validation_1.default(auth_validation_1.updateResetPasswordValidation), controller.verifyResetPasswordMiddleWare, controller.updateResetPasswordRoute);
exports.default = router;
