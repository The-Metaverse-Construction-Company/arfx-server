import express, {Request, Response} from 'express'
import { authorize, LOGGED_USER } from '../../../middlewares/auth';
import PaymentCardRoute from './payment-card.route'

import * as UserSettingRoute from '../../../controllers/user-settings/index.controller'
const router = express.Router({mergeParams: true});
router.use('/payment-card', 
  PaymentCardRoute)
/**x
 * @swagger
 * /v1/users/{userId}/settings/password:
 *  patch:
 *    summary: "Set/update new user password."
 *    tags:
 *      - "User Settings"
 *    security:
 *      - userBearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/User/id'
 *    requestBody:
 *      $ref: '#/components/requestBody/User/changePassword'
 *    responses:
 *      '200':
 *        $ref: '#/components/responses/User/Detail'
 */
router.patch('/password', 
  UserSettingRoute.userChangePasswordRoute)

export default router;
