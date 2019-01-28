const omit = require('lodash.omit');
const { Groups } = require('../model');

const createGroup = ({ title, description, metadata  }) =>
  Groups.create({
    title: title || '',
    description: description || '',
    metadata
  }).then(group =>
    omit(
      group.get({
        plain: true
      }),
      Groups.excludeAttributes
    )
  );

const getGroup = ({ id }) =>
  Groups.findOne({
    where: {
      id
    }
  }).then(user =>
    user && !user.deletedAt
      ? omit(
          user.get({
            plain: true
          }),
          Groups.excludeAttributes
        )
      : Promise.reject(new Error('UNKOWN OR DELETED USER'))
  );

// UpdateAt automatique refresh -> 
const deleteUserGroup = ({ id }) =>
  Groups.update( {deletedAt : Date.now() },{
    where: {id},
    returning: true,
    plain: true
  }).then(user =>
    user && !user.deletedAt
      ? true
    : Promise.reject(new Error('CANT DELETED USER'))
  );

/* const addUserGroup = (id, idgroup) => // pas moyen de passer req.body ?
  Groups.findOne({
    where: {
      idgroup
    }
  }).then(group =>
    
  ); */

module.exports = {
  createGroup,
  getGroup,
  deleteUserGroup
  // addUserGroup
};

