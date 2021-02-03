import express, {Request, Response} from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/released-version.controller'

const router = express.Router();

router.route('/')
/**
 * @swagger
 * paths:
 *  /v1/electron-released-version:
 *    get:
 *      summary: Check the latest version released for electron desktop app.
 *      tags: 
 *        - "Electron Released Version"
 *      responses:
 *        '200':
 *          description: "OK"
 */
  .get(controller.ReleasedElectronVersionRoute)

export default router;
