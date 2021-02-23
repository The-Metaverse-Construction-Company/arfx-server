import mongoose from 'mongoose'
import { NODE_ENVIRONMENTS } from '../api/utils/constants';
const logger = require('./../config/logger');
const { mongo, env } = require('./vars');
import CosmosConfig from './azure-cosmos'
// set mongoose Promise to Bluebird
//@ts-ignore
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// print mongoose logs in dev env
if (env === NODE_ENVIRONMENTS.DEVELOPMENT) {
  mongoose.set('debug', true);
}

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
export default {
  connect: () => {
    console.log('mongo.uri :>> ', mongo.uri);
    mongoose
      .connect(mongo.uri, {
        useCreateIndex: true,
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => console.log('mongoDB connected...'));
    return mongoose.connection;
  },
  close: () => {
    mongoose.connection.close()
    return true
  }
}