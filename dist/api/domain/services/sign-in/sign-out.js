"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../utils/constants");
class UserSignIn {
    constructor(deps) {
        this.deps = deps;
        this.signOut = async (userId) => {
            try {
                await this.deps.revokeToken(userId, constants_1.TOKEN_TYPE.SIGN_IN);
                // add some logs or notification.
                return true;
            }
            catch (error) {
                console.log('Failed to sign-out user. \nError: ', error);
                throw error;
            }
        };
    }
}
exports.default = UserSignIn;
