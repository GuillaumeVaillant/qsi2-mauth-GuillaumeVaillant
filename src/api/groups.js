const express = require('express');
const jwt = require('jwt-simple');
const { createGroup, addUserGroup, getGroup } = require('../controller/groups');
const logger = require('../logger');

const apiGroups = express.Router();

// http://127.0.0.1:1818/api/v1/groups ok 
apiGroups.get('/', (req, res) =>
  getGroup().then(group => {
      res.status(201).send({
        success: true,
        profile: group,
        message: 'get groups',
      });
    })
    .catch(err => {
      logger.error(`💥 Failed to get groups : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`,
      });
    })
);

apiGroups.post('/', (req, res) =>
  !req.body.title || !req.body.description 
    ? res.status(400).send({
        success: false,
        message: 'title and description are required'
      })
    : createGroup(req.body)
        .then(group => {
          const token = jwt.encode({ id: group.id }, process.env.JWT_SECRET);
          return res.status(201).send({
            success: true,
            token: `JWT ${token}`,
            profile: group,
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

apiGroups.put('/', (req, res) =>
!req.body.id || !req.body.idGroup
? res.status(400).send({
    success: false,
    message: 'id and idGroup are required'
  })
: addUserGroup(req.body.id ,req.body.idGroup)
    .then(user => 
      res.status(201).send({
        success: true,
        profile: user,
        message: 'add user in group works'
      }))
    .catch(err => {
      logger.error(`💥 Failed to add user in group : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`
      });
    })
);


module.exports = { apiGroups };
