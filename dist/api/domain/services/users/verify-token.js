"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserVerifyTokenService = void 0;
class UserVerifyTokenService {
    constructor(deps) {
        this.deps = deps;
        /**
         * verify user token
         * @param token token of the users that do the action.
         * @param tokenType SIGN_UP|SIGN_IN|RESET_PASSWORD
         */
        this.verifyOne = async (token, tokenType) => {
            try {
                const { referenceId } = await this.deps.verifyToken(token, tokenType);
                // fetch user by email.
                const user = this.deps.userDetails.findOne(referenceId, { password: 0 });
                return user;
            }
            catch (error) {
                console.log('Failed to verify user token. \nError: ', error.message);
                throw error;
            }
        };
    }
}
exports.UserVerifyTokenService = UserVerifyTokenService;
