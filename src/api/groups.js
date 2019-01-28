const express = require('express');
const jwt = require('jwt-simple');
const { createGroup } = require('../controller/groups');
const logger = require('../logger');

const apiGroups = express.Router();

// http://127.0.0.1:1818/api/v1/groups ok 
apiGroups.get('/', (req, res) =>
  res.status(200).send({
    success: true,
    message: 'api group build'
  })
);

apiGroups.post('/', (req, res) =>
  !req.body.title || !req.body.description 
    ? res.status(400).send({
        success: false,
        message: 'title and description are required'
      })
    : createGroup(req.body)
        .then(user => {
          const token = jwt.encode({ id: user.id }, process.env.JWT_SECRET);
          return res.status(201).send({
            success: true,
            token: `JWT ${token}`,
            profile: user,
            message: 'group created'
          });
        })
        .catch(err => {
          logger.error(`💥 Failed to create group : ${err.stack}`);
          return res.status(500).send({
            success: false,
            message: `${err.name} : ${err.message}`
          });
        })
);

module.exports = { apiGroups };
