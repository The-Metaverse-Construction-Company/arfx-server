"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("./config/mongoose"));
// make bluebird default Promise
const vars_1 = require("./config/vars");
const logger_1 = __importDefault(require("./config/logger"));
const express_1 = __importDefault(require("./config/express"));
Promise = require('bluebird'); // eslint-disable-line no-global-assign
// open mongoose connection
mongoose_1.default.connect();
// listen to requests
express_1.default.listen(vars_1.port, () => logger_1.default.info(`server started on port ${vars_1.port} (${vars_1.env})`));
/**
* Exports express
* @public
*/
exports.default = express_1.default;
