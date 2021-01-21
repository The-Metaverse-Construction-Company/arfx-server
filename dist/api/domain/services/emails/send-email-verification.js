"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../../../models/user.model"));
const constants_1 = require("../../../utils/constants");
class SendEmailVerification {
    constructor(deps) {
        this.deps = deps;
        this.sendOne = async (userId, token) => {
            try {
                // initiate user entity to run the validation for business rules.
                // insert to repository.
                const user = await user_model_1.default.findOne({ _id: userId });
                // if the email is already verified, then skip sending email.
                if (user && !user.email.verified) {
                    this.deps.sendEmail({
                        name: user.name,
                        token,
                        email: user.email.value,
                        url: `${constants_1.CLIENT_HOST}/ui/verification?token${token}&tokenType=${constants_1.TOKEN_TYPE.SIGN_UP}`
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
exports.default = SendEmailVerification;
