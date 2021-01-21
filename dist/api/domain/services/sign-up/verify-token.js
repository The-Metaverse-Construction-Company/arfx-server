"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../utils/constants");
class VerifyUser {
    constructor(deps) {
        this.deps = deps;
        this.verifyOne = async (token) => {
            try {
                const user = await this.deps.verifyUserToken.verifyOne(token, constants_1.TOKEN_TYPE.SIGN_UP);
                if (user.email.verified) {
                    throw new Error('User already verified.');
                }
                return user;
            }
            catch (error) {
                throw error;
            }
        };
    }
}
exports.default = VerifyUser;
