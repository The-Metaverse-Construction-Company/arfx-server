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
 * @entities
 */
import { ALLOWED_USER_ROLE } from '../../domain/entities/users'
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
} from '../../validations/user.validation'

/**
 * @routes
 */
import SettingsRoute from './settings'
import UserProductsRoute from './user-products.route'
import PurchaseHistoryRoute from './purchase-history.route'

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
router.param('userId', controller.load);
router
  .route('/')
/**
 * @swagger
 * /v1/users:
 *  patch:
 *    summary: "List of the user/customer."
 *    tags:
 *      - "Users"
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        $ref: '#/components/responses/User/List'
 */
  .get(authorizeAdminAccount(), validate(listUsers), controller.list)
  // .get(authorize(ALLOWED_USER_ROLE.ADMIN), validate(listUsers), controller.list)
  /**x
   * @api {post} v1/users Create User
   * @apiDescription Create a new user
   * @apiVersion 1.0.0
   * @apiName CreateUser
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             email     User's email
   * @apiParam  {String{6..128}}     password  User's password
   * @apiParam  {String{..128}}      [name]    User's name
   * @apiParam  {String=user,admin}  [role]    User's role
   *
   * @apiSuccess (Created 201) {String}  id         User's id
   * @apiSuccess (Created 201) {String}  name       User's name
   * @apiSuccess (Created 201) {String}  email      User's email
   * @apiSuccess (Created 201) {String}  role       User's role
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  // .post(validate(createUser), controller.create);
  .post(authorize(ALLOWED_USER_ROLE.ADMIN), validate(createUser), controller.create);


// router
//   .route('/profile')
//   .get(authorize(), controller.loggedIn);


router
  .route('/:userId')
/**x
 * @swagger
 * /v1/users/{userId}:
 *  patch:
 *    summary: "List of the user/customer."
 *    tags:
 *      - "Users"
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - $ref: '#/components/requestParams/User/id'
 *    responses:
 *      '200':
 *        $ref: '#/components/responses/User/Detail'
 */
  .get(authorize(LOGGED_USER), controller.get)
  // .put(authorize(LOGGED_USER), validate(replaceUser), controller.replace)
  // .patch(authorize(LOGGED_USER), validate(updateUser), controller.update)
  // .delete(authorize(LOGGED_USER), controller.remove);

  router
    .route('/:userId/resend-verification')
    .post(authorizeAdminAccount(), controller.resendAccountVerificationOTPRoute)
export default router;
