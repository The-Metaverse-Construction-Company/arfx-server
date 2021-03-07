import express from 'express'
import * as controller from '../../controllers/admin-account/index.controller'
import * as authCrontroller from '../../controllers/admin-account/auth.controller'
import {
  authorize, authorizeAdminAccount,
  azureAdAminAuth
} from '../../middlewares/auth'
import * as adminValidations from '../../validations/admin-account.validation'
import { ALLOWED_USER_ROLE } from '../../domain/entities/users'
import { PaginationQueryPipeline, requestValidatorMiddleware } from '../../validations'
const router = express.Router();
/**x
 * @swagger
 * paths:
 *  /v1/admin-accounts/auth:
 *    get:
 *      summary: validate admin auth token.
 *      security:
 *        - adminBearerAuth: []
 *      tags: 
 *        - "Admin Account Authentication"
 *      responses:
 *        '201':
 *          description: "OK"
 */
router.get('/auth/azure', azureAdAminAuth(), authCrontroller.validateAuthTokenRoute)
router.get('/auth', authorizeAdminAccount(), authCrontroller.validateAuthTokenRoute)
/**xx
 * @swagger
 * paths:
 *  /v1/admin-accounts/auth/sign-in:
 *    post:
 *      summary: sign in or login admin account.
 *      tags: 
 *        - "Admin Account Authentication"
 *      requestBody:
 *         $ref: '#/components/requestBody/AdminAccount/signIn'
 *      responses:
 *        '201':
 *          description: "OK"
 */
router.route('/auth/sign-in')
  .post(
    adminValidations.SignInFormValidationPipeline,
    requestValidatorMiddleware,
    authCrontroller.signInAdminAccountRoute
  )
// router.use('/', authorizeAdminAccount()) // disable this to create the first admin acct.
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
  .post(
    adminValidations.FormPipeline,
    requestValidatorMiddleware,
    controller.createAdminAccountRoute
  )
/**
 * @swagger
 * paths:
 *  /v1/admin-accounts:
 *    get:
 *      summary: List of Admin Account.
 *      security:
 *        - adminBearerAuth: []
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
  .get(authorizeAdminAccount(),
    PaginationQueryPipeline,
    requestValidatorMiddleware,
    controller.adminAccountListRoute
    )
router.route('/:adminAccountId')
/**
 * @swagger
 * paths:
 *  /v1/admin-accounts/{adminAccountId}:
 *    patch:
 *      summary: update Admin Account.
 *      security:
 *        - adminBearerAuth: []
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
  .patch(
    authorizeAdminAccount(),
    adminValidations.FormPipeline,
    requestValidatorMiddleware,
    controller.updateAdminAccountRoute
  )
/**
 * @swagger
 * paths:
 *  /v1/admin-accounts/{adminAccountId}:
 *    get:
 *      summary: details of Admin Account.
 *      security:
 *        - adminBearerAuth: []
 *      tags: 
 *        - "Admin Account"
 *      parameters:
 *        - $ref: '#/components/requestParams/AdminAccount/id'
 *      responses:
 *        '200':
 *          description: "OK"
 */
  .get(
    authorizeAdminAccount(),
    controller.adminAccountDetailsRoute
  )

export default router;
