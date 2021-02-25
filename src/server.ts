import App from './index'
// make bluebird default Promise
import {port, env } from './config/vars'
import logger from './config/logger'
// listen to 
App.listen(port, () => logger.info(`server started on port ${port} (${env})`));
/**
* Exports express
* @public
*/
