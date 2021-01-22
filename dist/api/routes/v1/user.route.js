"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @libraries
 */
const express_1 = __importDefault(require("express"));
const express_validation_1 = __importDefault(require("express-validation"));
/**
 * @controllers
 */
const controller = __importStar(require("../../controllers/user.controller"));
/**
 * @entities
 */
const users_1 = require("../../domain/entities/users");
/**
 * @middlewares
 */
const auth_1 = require("../../middlewares/auth");
const user_validation_1 = require("../../validations/user.validation");
/**
 * @routes
 */
const settings_1 = __importDefault(require("./settings"));
const router = express_1.default.Router({ mergeParams: true });
/**
 * expose settings route here
 */
router
    .get('/:userId/settings', settings_1.default);
/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);
router
    .route('/')
    /**
     * @api {get} v1/users List Users
     * @apiDescription Get a list of users
     * @apiVersion 1.0.0
     * @apiName ListUsers
     * @apiGroup User
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {Number{1-}}         [page=1]     List page
     * @apiParam  {Number{1-100}}      [perPage=1]  Users per page
     * @apiParam  {String}             [name]       User's name
     * @apiParam  {String}             [email]      User's email
     * @apiParam  {String=user,admin}  [role]       User's role
     *
     * @apiSuccess {Object[]} users List of users.
     *
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    // .get(validate(listUsers), controller.list)
    .get(auth_1.authorize(auth_1.LOGGED_USER), express_validation_1.default(user_validation_1.listUsers), controller.list)
    // .get(authorize(ALLOWED_USER_ROLE.ADMIN), validate(listUsers), controller.list)
    /**
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
    .post(auth_1.authorize(users_1.ALLOWED_USER_ROLE.ADMIN), express_validation_1.default(user_validation_1.createUser), controller.create);
router
    .route('/profile')
    /**
     * @api {get} v1/users/profile User Profile
     * @apiDescription Get logged in user profile information
     * @apiVersion 1.0.0
     * @apiName UserProfile
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Users can access the data
     */
    .get(auth_1.authorize(), controller.loggedIn);
router
    .route('/:userId')
    /**
     * @api {get} v1/users/:id Get User
     * @apiDescription Get user information
     * @apiVersion 1.0.0
     * @apiName GetUser
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
     * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .get(auth_1.authorize(auth_1.LOGGED_USER), controller.get)
    /**
     * @api {put} v1/users/:id Replace User
     * @apiDescription Replace the whole user document with a new one
     * @apiVersion 1.0.0
     * @apiName ReplaceUser
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {String}             email     User's email
     * @apiParam  {String{6..128}}     password  User's password
     * @apiParam  {String{..128}}      [name]    User's name
     * @apiParam  {String=user,admin}  [role]    User's role
     * (You must be an admin to change the user's role)
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
     * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .put(auth_1.authorize(auth_1.LOGGED_USER), express_validation_1.default(user_validation_1.replaceUser), controller.replace)
    /**
     * @api {patch} v1/users/:id Update User
     * @apiDescription Update some fields of a user document
     * @apiVersion 1.0.0
     * @apiName UpdateUser
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {String}             email     User's email
     * @apiParam  {String{6..128}}     password  User's password
     * @apiParam  {String{..128}}      [name]    User's name
     * @apiParam  {String=user,admin}  [role]    User's role
     * (You must be an admin to change the user's role)
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
     * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .patch(auth_1.authorize(auth_1.LOGGED_USER), express_validation_1.default(user_validation_1.updateUser), controller.update)
    /**
     * @api {patch} v1/users/:id Delete User
     * @apiDescription Delete a user
     * @apiVersion 1.0.0
     * @apiName DeleteUser
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess (No Content 204)  Successfully deleted
     *
     * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
     * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
     * @apiError (Not Found 404)    NotFound      User does not exist
     */
    .delete(auth_1.authorize(auth_1.LOGGED_USER), controller.remove);
exports.default = router;
