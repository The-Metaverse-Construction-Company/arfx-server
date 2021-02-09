/**
 * @libraries
 */
import express from 'express'
import validate from 'express-validation'
/**
 * @controllers
 */
import * as controller from '../../controllers/user.controller'
/**
 * @middlewares
 */
import {
  authorize, ADMIN, LOGGED_USER, authorizeAdminAccount
} from '../../middlewares/auth'
import {
  listUsers,
  createUser,
  replaceUser,
  updateUser,
  createUserPipeline
} from '../../validations/user.validation'

/**
 * @routes
 */
import SettingsRoute from './settings'
import UserProductsRoute from './user-products.route'
import PurchaseHistoryRoute from './purchase-history.route'
import { requestValidatorMiddleware } from '../../validations'

const router = express.Router({mergeParams: true});

/**
 * expose settings route here
 */
router
  .use('/:userId/settings', authorize(LOGGED_USER), SettingsRoute)
  .use('/:userId/products', authorize(LOGGED_USER), UserProductsRoute)
  .use('/:userId/purchase-history', authorize(LOGGED_USER), PurchaseHistoryRoute)
/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.UserDetailsMiddleware);
router
  .route('/')
/**
 * @swagger
 * /v1/users:
 *  get:
 *    summary: "List of the user/customer."
 *    tags:
 *      - "Users"
 *    security:
 *      - adminBearerAuth: []
 *    responses:
 *      '200':
 *        $ref: '#/components/responses/User/List'
 */
  .get(authorizeAdminAccount(), validate(listUsers), controller.UserListRoute)
/**
 * @swagger
 * /v1/users:
 *  post:
 *    summary: "create selected user/customer."
 *    tags:
 *      - "Users"
 *    security:
 *      - adminBearerAuth: []
 *    requestBody:
 *      $ref: '#/components/requestBody/User/createForm'
 *    responses:
 *      '200':
 *        $ref: '#/components/responses/User/Detail'
 */
  .post(authorizeAdminAccount(), 
    createUserPipeline,
    requestValidatorMiddleware,
    controller.CreateUserRoute
    );

router
  .route('/:userId')
/**x
 * @swagger
 * /v1/users/{userId}:
 *  get:
 *    summary: "Details of the user/customer."
 *    tags:
 *      - "Users"
 *    security:
 *      - userBearerAuth: []
 *      - adminBearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/User/id'
 *    responses:
 *      '200':
 *        $ref: '#/components/responses/User/Detail'
 */
  .get(authorize(), controller.UserDetailsRoute)
/**
 * @swagger
 * /v1/users/{userId}:
 *  patch:
 *    summary: "Update selected user/customer."
 *    tags:
 *      - "Users"
 *    security:
 *      - userBearerAuth: []
 *      - adminBearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/User/id'
 *    requestBody:
 *      $ref: '#/components/requestBody/User/updateForm'
 *    responses:
 *      '200':
 *        $ref: '#/components/responses/User/Detail'
 */
  .patch(authorize(), controller.UpdateUserRoute)
/**
 * @swagger
 * /v1/users/{userId}:
 *  delete:
 *    summary: "Suspend the selected customer/user account."
 *    tags:
 *      - "Users"
 *    security:
 *      - adminBearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/User/id'
 *    responses:
 *      '201':
 *        $ref: '#/components/responses/User/Detail'
 */
  .delete(authorizeAdminAccount(), controller.SuspendUserRoute)
  router
    .route('/:userId/unsuspend')
/**
 * @swagger
 * /v1/users/{userId}/unsuspend:
 *  patch:
 *    summary: "Unsuspend user/customer account."
 *    tags:
 *      - "Users"
 *    security:
 *      - adminBearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/User/id'
 *    responses:
 *      '200':
 *        $ref: '#/components/responses/User/Detail'
 */
    .patch(authorizeAdminAccount(), controller.UnsuspendUserRoute)
  router
    .route('/:userId/resend-sign-in-otp')
/**
 * @swagger
 * /v1/users/{userId}/resend-sign-in-otp:
 *  post:
 *    summary: "resend user sign-up OTP."
 *    tags:
 *      - "Users"
 *    security:
 *      - adminBearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/User/id'
 *    responses:
 *      '200':
 *        $ref: '#/components/responses/User/resendOTP'
 */
    // .post(controller.resendAccountVerificationOTPRoute)
    .post(authorizeAdminAccount(), controller.resendAccountVerificationOTPRoute)
export default router;
