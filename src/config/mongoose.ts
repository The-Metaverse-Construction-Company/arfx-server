import mongoose from 'mongoose'
import { NODE_ENVIRONMENTS } from '../api/utils/constants';
import logger from './../config/logger'
import { mongo, NODE_ENV } from "./vars"
// set mongoose Promise to Bluebird
//@ts-ignore
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// print mongoose logs in dev env
if (NODE_ENV === NODE_ENVIRONMENTS.DEVELOPMENT) {
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
        // keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => console.log('mongoDB connected...'))
      .catch((err) => {
        console.log('failed to connect thru database. ERROR: ', err.message);
      });
    return mongoose.connection;
  },
  close: () => {
    mongoose.connection.close()
    return true
  }
}