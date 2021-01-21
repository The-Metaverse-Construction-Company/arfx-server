"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSearchTextFields = void 0;
exports.generateSearchTextFields = (fields, searchText = '') => {
    return (fields.length >= 1 ? fields : []).map((field) => ({ [field]: {
            $regex: new RegExp(searchText, 'gi')
        } }));
};
