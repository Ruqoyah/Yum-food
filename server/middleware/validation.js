import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import models from '../models';
import { capitalize } from '../helper';

dotenv.config();

const { Users, Foods } = models;

/** Check if signup field is empty
 *
 * @param  {object} req - request
 * @param  {object} res - response
 * @param  {object} next - next
 *
 */

export const checkUserInput = (req, res, next) => {
  if (!req.body.username) {
    return res.status(400).json({
      status: false,
      message: 'Username is required'
    });
  }
  if (!req.body.fullName) {
    return res.status(400).json({
      status: false,
      message: 'fullName is required'
    });
  }
  if (!req.body.email) {
    return res.status(400).json({
      status: false,
      message: 'Email is required'
    });
  }
  if (!req.body.password) {
    return res.status(400).json({
      status: false,
      message: 'Password is required'
    });
  }
  next();
};


/** Check if user signup with a valid username, email and password
 *
 * @param  {object} req - request
 * @param  {object} res - response
 * @param  {object} next - next
 *
 */

export const checkValidUserInput = (req, res, next) => {
  req.checkBody(
    {
      username: {
        notEmpty: true,
        isLength: {
          options: [{ min: 5 }],
          errorMessage: 'Please provide a username with atleast 5 characters.'
        }
      },
      email: {
        notEmpty: true,
        isEmail: {
          errorMessage: 'Provide a valid a Email Adrress'
        }
      },
      password: {
        notEmpty: true,
        isLength: {
          options: [{ min: 5 }],
          errorMessage: 'Provide a valid password with minimum of 8 characters'
        }
      }
    }
  );
  const errors = req.validationErrors();
  if (errors) {
    const allErrors = [];
    errors.forEach((error) => {
      allErrors.push({
        error: error.msg,
      });
    });
    return res.status(409)
      .json(allErrors);
  }
  next();
};


/** Check invalid input for signup field
 *
 * @param  {object} req - request
 * @param  {object} res - response
 * @param  {object} next - next
 */

export const checkUserInvalidInput = (req, res, next) => {
  const numberCheck = /((\d)+)/gi;
  const checkSpace = /(\s){1}/;
  const countMutipleSpace = /(\s){2}/;

  if (numberCheck.test(req.body.username) ||
    checkSpace.test(req.body.username) ||
    /(\s)+/.test(req.body.username[0])) {
    return res.status(400).json({
      status: false,
      message: 'Invalid Username'
    });
  }
  if (checkSpace.test(req.body.password) ||
    /(\s)+/.test(req.body.password[0])) {
    return res.status(400).json({
      status: false,
      message: 'Invalid Password'
    });
  }
  if (numberCheck.test(req.body.fullName) ||
    countMutipleSpace.test(req.body.fullName) ||
    /(\s)+/.test(req.body.fullName[0])) {
    return res.status(400).json({
      status: false,
      message: 'Invalid full name'
    });
  }
  next();
};

/** Check if username and email already exist
 *
 * @param  {object} req - request
 * @param  {object} res - response
 * @param  {object} next - next
 *
 */

export const validateUsers = (req, res, next) => {
  Users
    .findOne({
      where: {
        username: req.body.username
      },
    })
    .then((user) => {
      if (user) {
        return res.status(409).json({
          status: false,
          message: 'Username already exists'
        });
      }
      Users
        .findOne({
          where: {
            email: req.body.email
          },
        })
        .then((email) => {
          if (email) {
            return res.status(409).json({
              status: false,
              message: 'Email already exists'
            });
          }
          next();
        });
    });
};

/** Check if user doesn't provide username and password
 * or if user input an incorrect password
 *
 * @param  {object} req - request
 * @param  {object} res - response
 * @param  {object} next - next
 *
 */

export const validateLoginUser = (req, res, next) => {
  if (!req.body.username) {
    return res.status(400).json({
      status: false,
      message: 'Please provide your username'
    });
  }
  if (!req.body.password) {
    return res.status(400).json({
      status: false,
      message: 'Please provide your password'
    });
  }
  Users
    .findOne({
      where: {
        username: req.body.username,
      },
    })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          status: false,
          message: 'Invalid Credentials'
        });
      } else if (user && user.role === 'user') {
        bcrypt.compare(req.body.password, user.password, (err, response) => {
          if (response) {
            next();
          } else {
            return res.status(401).json({
              status: false,
              message: 'Invalid Credentials'
            });
          }
        });
      }
      next();
    });
};


/** validate user id
 *
 * @param  {object} req - request
 * @param  {object} res - response
 * @param  {object} next - next
 *
 */

export const validateUserId = (req, res, next) => {
  const { userId } = req.decoded.currentUser;
  Users
    .findOne({
      where: {
        id: userId
      }
    })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'No user Id found'
        });
      } else if(user.role !== 'admin') {
        return res.status(401).json({
          status: false,
          message: 'You do not have access to perform this action'
        });
      }
      next();
    });
};

/** validate user id
 *
 * @param  {object} req - request
 * @param  {object} res - response
 * @param  {object} next - next
 *
 */

export const userExist = (req, res, next) => {
  console.log(req, 'req.decoded')
  const { userId } = req.decoded.currentUser;
  Users
    .findOne({
      where: {
        id: userId
      }
    })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'No user Id found'
        });
      }
      next();
    });
};

/** Check if food field is empty
 *
 * @param  {object} req - request
 * @param  {object} res - response
 * @param  {object} next - next
 *
 */

export const checkFoodInput = (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({
      status: false,
      message: 'Enter food name'
    });
  }
  if (!req.body.picture) {
    return res.status(400).json({
      status: false,
      message: 'You need to upload a picture'
    });
  }
  next();
};

/** Check if order field is empty
 *
 * @param  {object} req - request
 * @param  {object} res - response
 * @param  {object} next - next
 *
 */

export const checkOrderInput = (req, res, next) => {
  if (!req.body.foodId) {
    return res.status(400).json({
      status: false,
      message: 'You need to provide food id'
    });
  }
  if (!req.body.quantity) {
    return res.status(400).json({
      status: false,
      message: 'You need to provide quantity'
    });
  }
  next();
};

/** Check if user already post food
 *
 * @param  {object} req - request
 * @param  {object} res - response
 * @param  {object} next - next
 *
 */

export const foodExist = (req, res, next) => {
  const { userId } = req.decoded.currentUser;
  return Foods
    .findOne({
      where: {
        userId,
        name: capitalize(req.body.name)
      }
    })
    .then((food) => {
      if (!food) return next();
      return res.status(409).json({
        status: false,
        message: 'You have already created food'
      });
    });
};