const express = require('express');
const jwt = require('jwt-simple');
const { createUser, loginUser, deleteUser } = require('../controller/users');
const logger = require('../logger');

const apiUsers = express.Router();

// http://apidocjs.com/#params
/**
 * @api {post} /users User account creation
 * @apiVersion 1.0.0
 * @apiName createUser
 * @apiGroup Users
 *
 * @apiParam {STRING} email Email of the User.
 * @apiParam {STRING} password  Password of the User.
 * @apiParam {STRING} [firstName] First name of the User.
 * @apiParam {STRING} [lastName] Last name of the User.
 *
 * @apiSuccess {BOOLEAN} success Success.
 * @apiSuccess {STRING} message Message.
 * @apiSuccess {STRING} token JWT token.
 * @apiSuccess {JSON} profile Profile informations about the User.
 */
apiUsers.post('/', (req, res) =>
  !req.body.email || !req.body.password 
    ? res.status(400).send({
        success: false,
        message: 'email and password are required'
      })
    : createUser(req.body)
        .then(user => {
          const token = jwt.encode({ id: user.id }, process.env.JWT_SECRET);
          return res.status(201).send({
            success: true,
            token: `JWT ${token}`,
            profile: user,
            message: 'user created'
          });
        })
        .catch(err => {
          logger.error(`💥 Failed to create user : ${err.stack}`);
          return res.status(500).send({
            success: false,
            message: `${err.name} : ${err.message}`
          });
        })
);

/**
 * @api {post} /users/login User login
 * @apiVersion 1.0.0
 * @apiName loginUser
 * @apiGroup Users
 *
 * @apiParam {STRING} email Email of the User.
 * @apiParam {STRING} password  Password of the User.
 *
 * @apiSuccess {BOOLEAN} success Success.
 * @apiSuccess {STRING} message Message.
 * @apiSuccess {STRING} token JWT token.
 * @apiSuccess {JSON} profile Profile informations about the User.
 */
apiUsers.post('/login', (req, res) =>
  !req.body.email || !req.body.password
    ? res.status(400).send({
        success: false,
        message: 'email and password are required'
      })
    : loginUser(req.body)
        .then(user => {
          const token = jwt.encode({ id: user.id }, process.env.JWT_SECRET);
          return res.status(200).send({
            success: true,
            token: `JWT ${token}`,
            profile: user,
            message: 'user logged in'
          });
        })
        .catch(err => {
          logger.error(`💥 Failed to login user : ${err.stack}`);
          return res.status(500).send({
            success: false,
            message: `${err.name} : ${err.message}`
          });
        })
);

// Fonctionne avec le token de l'utilisateur -> pas besoin de verifier s'il s'est connecté
const apiUsersProtected = express.Router();

// GET /api/v1/users/  "get info of logged user"
apiUsersProtected.get('/', (req, res) =>
  res.status(200).send({
    success: true,
    profile: req.user,
    message: 'user logged in'
  })
);

// DELETE /api/v1/users/  "delete the logged user"
apiUsersProtected.delete('/', (req, res) =>
!req.user.id 
? res.status(400).send({
    success: false,
    message: 'id is required'
  })
: deleteUser(req.user)
    .then(user => 
      res.status(201).send({
        success: true,
        profile: user,
        message: 'delte user works'
      }))
    .catch(err => {
      logger.error(`💥 Failed to delte user : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`
      });
    })
);

module.exports = { apiUsers, apiUsersProtected };
