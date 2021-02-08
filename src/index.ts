import mongoose from './config/mongoose'
import app from './config/express'
Promise = require('bluebird'); // eslint-disable-line no-global-assign
// open mongoose connection
mongoose.connect();
/**
* Exports express
* @public
*/
export default app;
