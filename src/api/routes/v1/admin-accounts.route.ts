import express from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/admin-account/index.controller'
import * as authCrontroller from '../../controllers/admin-account/auth.controller'
import {
  authorize, authorizeAdminAccount
} from '../../middlewares/auth'
import * as adminValidations from '../../validations/admin-account.validation'
import { ALLOWED_USER_ROLE } from '../../domain/entities/users'
import { PaginationQueryPipeline, requestValidatorMiddleware } from '../../validations'
const router = express.Router();
router.get('/auth', authorizeAdminAccount(), authCrontroller.validateAuthTokenRoute)
router.route('/auth/sign-in')
  .post(authCrontroller.signInAdminAccountRoute)
// router.use('/', authorizeAdminAccount())
router.route('/')
/**
 * @swagger
 * paths:
 *  /v1/admin-accounts:
 *    post:
 *      summary: Create Admin Account.
 *      tags: 
 *        - "Admin Account"
 *      requestBody:
 *         $ref: '#/components/requestBody/AdminAccount/form'
 *      responses:
 *        '201':
 *          description: "OK"
 */
  .post(adminValidations.FormPipeline, requestValidatorMiddleware, controller.createAdminAccountRoute)
/**
 * @swagger
 * paths:
 *  /v1/admin-accounts:
 *    get:
 *      summary: List ofAdmin Account.
 *      tags: 
 *        - "Admin Account"
 *      parameters:
 *        - $ref: '#/components/requestQuery/pageNo'
 *        - $ref: '#/components/requestQuery/limit'
 *        - $ref: '#/components/requestQuery/searchText'
 *      responses:
 *        '200':
 *          description: "OK"
 */
  .get(PaginationQueryPipeline, requestValidatorMiddleware, controller.adminAccountListRoute)
router.route('/:adminAccountId')
/**
 * @swagger
 * paths:
 *  /v1/admin-accounts/{adminAccountId}:
 *    patch:
 *      summary: update Admin Account.
 *      tags: 
 *        - "Admin Account"
 *      parameters:
 *        - $ref: '#/components/requestParams/AdminAccount/id'
 *      requestBody:
 *         $ref: '#/components/requestBody/AdminAccount/form'
 *      responses:
 *        '202':
 *          description: "OK"
 */
  .patch(adminValidations.FormPipeline, requestValidatorMiddleware, controller.updateAdminAccountRoute)
/**
 * @swagger
 * paths:
 *  /v1/admin-accounts/{adminAccountId}:
 *    get:
 *      summary: details of Admin Account.
 *      tags: 
 *        - "Admin Account"
 *      parameters:
 *        - $ref: '#/components/requestParams/AdminAccount/id'
 *      responses:
 *        '200':
 *          description: "OK"
 */
  .get(controller.adminAccountDetailsRoute)

export default router;
