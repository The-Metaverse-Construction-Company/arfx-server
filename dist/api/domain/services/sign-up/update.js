"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../utils/constants");
class VerifiedUu {
    constructor(deps) {
        this.deps = deps;
        this.updateOne = async (userId) => {
            try {
                const user = await this.deps.findOneById(userId, { password: 0 });
                user.email.verified = true;
                user.email.verifiedAt = Date.now();
                await this.deps.revokeToken(userId, constants_1.TOKEN_TYPE.SIGN_UP);
                await user.save();
                //add some logs
                return user;
            }
            catch (error) {
                throw error;
            }
        };
    }
}
exports.default = VerifiedUu;
