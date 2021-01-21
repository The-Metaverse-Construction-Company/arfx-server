"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = __importDefault(require("../../../models/user.model"));
const APIError_1 = __importDefault(require("../../../utils/APIError"));
class ValidateDuplicateEmail {
    constructor() {
        this.validateOne = async ({ email = '', userId = '' }) => {
            try {
                const query = {
                    'email.value': email
                };
                // ignore the provided userId on finding duplicate email.
                // most likely will use on update function
                if (userId) {
                    query._id = {
                        $ne: userId
                    };
                }
                // initiate user entity
                const user = await user_model_1.default.findOne(query);
                if (user) {
                    throw new APIError_1.default({
                        message: 'Validation Error',
                        errors: [{
                                field: 'email',
                                location: 'body',
                                messages: ['"email" already exists'],
                            }],
                        status: http_status_1.default.CONFLICT,
                        isPublic: true
                    });
                }
                //add some logs
                return true;
            }
            catch (error) {
                console.log('error :>> ', error);
                throw error;
            }
        };
    }
}
exports.default = ValidateDuplicateEmail;
