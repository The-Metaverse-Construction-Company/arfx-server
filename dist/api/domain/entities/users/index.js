"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./interfaces"), exports);
__exportStar(require("./constants"), exports);
const { ALLOWED_USER_ROLE } = require("./constants");
const allowed_roles = Object.values(ALLOWED_USER_ROLE);
exports.default = ({ generateId, hash }) => (
/**
 * _id: user id
 * name: name of the user
 * email: email of the user
 * role: admin/user
 * password: hashed password
 * mobileNumber: mobileNumber
 * avatarUrl: profileUrl or avatar of the user
 */
class UserEntity {
    constructor({ _id = '', name = '', email = '', mobileNumber = '', role = '', password = '', avatarUrl = '' }) {
        this._id = '';
        this.name = '';
        this.role = '';
        this.password = '';
        this.avatarUrl = '';
        this.createdAt = 0;
        this.updatedAt = 0;
        if (!_id) {
            _id = generateId();
        }
        if (!allowed_roles.includes(role)) {
            throw new Error(`Invalid user roles. Valid Roles: ${allowed_roles.join(', ')}.`);
        }
        this._id = _id;
        this.email = {
            value: email,
            verified: false,
            verifiedAt: 0
        };
        this.mobileNumber = {
            value: mobileNumber,
            verified: false,
            verifiedAt: 0
        };
        this.name = name;
        this.role = role;
        this.password = hash(password);
        this.avatarUrl = avatarUrl;
        this.createdAt = Date.now();
        this.updatedAt = Date.now();
        this.services = {
            facebook: '',
            google: '',
        };
    }
});
