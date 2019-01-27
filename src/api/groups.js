const express = require('express');
const jwt = require('jwt-simple');
const { createGroup, deleteUserGroup, addUserGroup } = require('../controller/groups');
const logger = require('../logger');

const apiGroups = express.Router();

// http://127.0.0.1:1818/api/v1/groups ok 
apiGroups.get('/', (req, res) =>
  res.status(200).send({
    success: true,
    message: 'api group build'
  })
);

module.exports = { apiGroups };
