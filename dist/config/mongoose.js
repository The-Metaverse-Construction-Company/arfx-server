"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger = require('./../config/logger');
const { mongo, env } = require('./vars');
// set mongoose Promise to Bluebird
//@ts-expect-error
mongoose_1.default.Promise = Promise;
// Exit application on error
mongoose_1.default.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
});
// print mongoose logs in dev env
if (env === 'development') {
    mongoose_1.default.set('debug', true);
}
/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.default = {
    connect: () => {
        mongoose_1.default
            .connect(mongo.uri, {
            useCreateIndex: true,
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })
            .then(() => console.log('mongoDB connected...'));
        return mongoose_1.default.connection;
    }
};
