import App from './index'
// make bluebird default Promise
import {port, NODE_ENV } from './config/vars'
import logger from './config/logger'
// listen to 
App.listen(port, () => logger.info(`server started on port ${port} (${NODE_ENV})`));
/**
* Exports express
* @public
*/
