import express from 'express';
import UserController from '../controllers/UserController';
import FoodController from '../controllers/FoodController';
import OrderController from '../controllers/OrderController';
import {
    checkUserInput,
    checkValidUserInput,
    checkUserInvalidInput,
    validateUsers,
    validateLoginUser,
    checkFoodInput,
    foodExist,
    validateUserId,
    checkOrderInput,
    userExist
  } from '../middleware/validation';
import authentication from '../middleware/authentication';



const app = express.Router();


/** Signup
 * @param  {} '/signup'
 * @param  {} checkUserInput
 * @param  {} checkValidUserInput
 * @param  {} checkUserInvalidInput
 * @param  {} validateUsers
 * @param  {} UserController.signup
 */
app.post(
  '/signup', 
  checkUserInput,
  checkValidUserInput,
  checkUserInvalidInput,
  validateUsers,
  UserController.signup
);

/** Signin
 *
 * @param  {} '/login'
 * @param  {} validateLoginUser
 * @param  {} UserController.signin
 */
app.post(
  '/login',
  validateLoginUser,
  UserController.signin
);


/** Get user
 *
 * @param  {} '/me'
 * @param  {} UserController.getUser
 *
 */
app.get(
  '/me',
  authentication.authenticate,
  UserController.getUser
);

/** Add food
 * @param  {} '/admin/menu'
 * @param  {} authentication.authenticate
 * @param  {} checkFoodInput
 * @param  {} validateUserId
 * @param  {} FoodController.addFood
 */
app.post(
  '/admin/menu',
  authentication.authenticate,
  checkFoodInput,
  validateUserId,
  foodExist,
  FoodController.addFood
);

/** Get all foods in menu
 *
 * @param  {} '/menu'
 * @param  {} authentication.authenticate
 * @param  {} FoodController.getAllFoods
 *
 */
app.get(
  '/menu',
  authentication.authenticate,
  FoodController.getAllFoods
);

/** Place Order
 *
 * @param  {} '/order'
 * @param  {} authentication.authenticate
 * @param  {} checkOrderInput
 * @param  {} userExist
 * @param  {} OrderController.placeOrder
 */
app.post(
  '/order',
  authentication.authenticate,
  checkOrderInput,
  userExist,
  OrderController.placeOrder
);


/** Update Order
 *
 * @param  {} '/order/:orderId'
 * @param  {} authentication.authenticate
 * @param  {} userExist
 * @param  {} OrderController.modifyOrder
 */
app.put(
  '/order/:orderId',
  authentication.authenticate,
  userExist,
  OrderController.modifyOrder
);

/** Delete order
 *
 * @param  {recipeId'} '/order/:orderId'
 * @param  {} authentication.authenticate
 * @param  {} userExist
 * @param  {} OrderController.deleteOrder
 *
 */
app.delete(
  '/order/:orderId',
  authentication.authenticate,
  userExist,
  OrderController.deleteOrder
);

/** Get Orders
 * @param  {} '/admin/orders'
 * @param  {} authentication.authenticate
 * @param  {} validateUserId
 * @param  {} OrderController.getAllOrders
 */
app.get(
  '/admin/orders',
  authentication.authenticate,
  validateUserId,
  OrderController.getAllOrders
);

/** Update Order Status
 *
 * @param  {} '/admin/orders/:orderId'
 * @param  {} authentication.authenticate
 * @param  {} validateUserId
 * @param  {} OrderController.modifyOrderStatus
 */
app.put(
  '/admin/orders/:orderId',
  authentication.authenticate,
  validateUserId,
  OrderController.modifyOrderStatus
);

export default app;
