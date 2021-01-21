"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../utils/constants");
const entities_1 = require("../../entities");
class UserVerifyResetPassword {
    constructor(deps) {
        this.deps = deps;
        this.updateOne = async (userId, newPassword) => {
            try {
                // fetch user by email.
                const user = await this.deps.findUserDetailsById(userId, { password: 0 });
                // create user entity instance to run the business rules validations. and also to hash the password.
                const newUser = new entities_1.UserEntity({
                    ...JSON.parse(JSON.stringify(user)),
                    password: newPassword
                });
                user.password = newUser.password;
                user.updatedAt = newUser.updatedAt;
                // revoke the token to make it invalid or expired.
                await this.deps.revokeToken(userId, constants_1.TOKEN_TYPE.RESET_PASSWORD);
                user.save();
                // add some logs or notifications
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
