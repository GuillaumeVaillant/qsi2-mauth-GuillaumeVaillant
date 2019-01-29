const express = require('express');
const hpp = require('helmet');
const helmet = require('hpp');
const enforce = require('express-sslify');
const { apiUsers, apiUsersProtected } = require('./users');
const { apiGroups} = require('./groups');
const { isAuthenticated, initAuth } = require('../controller/auth');
// create an express Application for our api

const api = express();

api.use(hpp());
api.use(helmet());
// api.use(enforce.HTTPS());
api.use(enforce.HTTPS({ trustProtoHeader: true }));

initAuth();
/*
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
api.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
api.use(bodyParser.json())
*/

// apply a middelware to parse application/json body

api.use(express.json({ limit: '1mb' }));

// create an express router that will be mount at the root of the api
const apiRoutes = express.Router();

apiRoutes
  // test api
  .get('/', (req, res) =>
    res.status(200).send({ message: 'hello from my api' })
  )
  // connect api users router
  .use('/users', apiUsers)
  // api bellow this middelware require Authorization -> à partir d'ici il faut avoir un token valide
  .use(isAuthenticated)
  .use('/users', apiUsersProtected)
  .use('/groups',apiGroups)
  .use((err, req, res, next) => {
    res.status(403).send({
      success: false,
      message: `${err.name} : ${err.message}`,
    });
    next();
  });

// root of our API will be http://127.0.0.1:3434/api/v1
api.use('/api/v1', apiRoutes);
module.exports = api;