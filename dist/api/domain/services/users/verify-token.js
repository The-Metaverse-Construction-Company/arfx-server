"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserVerifyResetPassword {
    constructor(deps) {
        this.deps = deps;
        this.verifyOne = async (token, tokenType) => {
            try {
                const { referenceId } = await this.deps.verifyToken(token, tokenType);
                // fetch user by email.
                const user = this.deps.findUserById(referenceId, { password: 0 });
                return user;
            }
            catch (error) {
                console.log('Failed to verify reset password token. \nError: ', error.message);
                throw error;
            }
        };
    }
}
exports.default = UserVerifyResetPassword;
