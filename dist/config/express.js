"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const v1_1 = __importDefault(require("../api/routes/v1"));
const body_parser_1 = __importDefault(require("body-parser"));
const method_override_1 = __importDefault(require("method-override"));
const passport_1 = __importDefault(require("passport"));
const vars_1 = require("./vars");
const strategies = __importStar(require("./passport"));
const error = __importStar(require("../api/middlewares/error"));
const redis_1 = __importDefault(require("./redis"));
const helmet = require('helmet');
const compress = require('compression');
const morgan = require('morgan');
const cors = require('cors');
/**
* Express instance
* @public
*/
const app = express_1.default();
// request logging. dev: console | production: file
app.use(morgan(vars_1.logs));
// parse body params and attache them to req.body
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// // console.log('RedisClient :>> ', RedisClient);
// load redis
app.set('redisPublisher', redis_1.default);
// gzip compression
app.use(compress());
// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(method_override_1.default());
// secure apps by setting various HTTP headers
app.use(helmet());
// enable CORS - Cross Origin Resource Sharing
app.use(cors());
// enable authentication
app.use(passport_1.default.initialize());
passport_1.default.use('jwt', strategies.jwt);
// passport.use('facebook', strategies.facebook);
// passport.use('google', strategies.google);
// mount api v1 routes
app.use('/v1', v1_1.default);
// if error is not an instanceOf APIError, convert it.
app.use(error.converter);
// catch 404 and forward to error handler
app.use(error.notFound);
// error handler, send stacktrace only during development
app.use(error.handler);
exports.default = app;
