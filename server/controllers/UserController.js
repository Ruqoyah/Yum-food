import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jsonwebtoken from 'jsonwebtoken';
import models from '../models';

dotenv.config();
const secret = process.env.SUPER_SECRET;

const { Users } = models;

const saltRounds = 10;

class UserController {

  /** Signup user
   *
   * @param  {object} req - request
   *
   * @param  {object} res - response
   *
   */

  static signup(req, res) {
    bcrypt.hash(req.body.password, saltRounds)
      .then((hash) => {
        Users.create({
          fullName: req.body.fullName,
          username: req.body.username,
          email: req.body.email,
          password: hash
        })
          .then((user) => {
            const currentUser = {
              userId: user.id
            };
            const token = jsonwebtoken.sign({
              exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
              currentUser
            }, secret);
            res.status(201).json({
              status: true,
              message: 'You have successfully signed up',
              data: { token }
            });
          })
          .catch(() => res.status(500).json({
            error: 'Internal sever Error'
          }));
      });
  }

  /** Signin user
   *
   * @param  {object} req - request
   *
   * @param  {object} res - response
   *
   */

  static signin(req, res) {
    return Users
      .findOne({
        where: { username: req.body.username }
      })
      .then((user) => {
        const currentUser = {
          userId: user.id
        };
        const token = jsonwebtoken.sign({
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
          currentUser },
        secret);
        res.status(200).json({
          status: true,
          message: 'You have successfully signed in!',
          data: { token }
        });
      });
  }


  /** Get User
   * @param  {object} req - request
   *
   * @param  {object} res - response
   *
   * @return {object} returns an object
   *
   */
  static getUser(req, res) {
    const { userId } = req.decoded.currentUser;
    return Users
      .findOne({
        where: { id: userId }
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: 'user does not exist'
          });
        }
        return res.status(200).json({
          status: true,
          data: {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            picture: user.picture
          }
        });
      })
      .catch(() => res.status(500).json({
        error: 'Internal sever Error' }
      ));
  }
};

export default UserController;
