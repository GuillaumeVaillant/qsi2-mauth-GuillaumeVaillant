// const omit = require('lodash.omit');
const { Groups } = require('../model');

const createGroup = ({ title, description, metadata, GroupAdmin  }) =>
  Groups.create({
    title: title || '',
    description: description || '',
    metadata,
    GroupAdmin
  }).then(group =>
    group ? Promise.resolve(group.addUser(GroupAdmin)) : Promise.reject(new Error('CANT CREATE GROUP'))
  );

  
const getGroup = () =>
  Groups.findAll();


const deleteUserGroup = (id, idGroup) =>
  Groups.findOne({
    where: {
      idGroup
    }
  }).then(group =>
    group ? Promise.resolve(group.removeUser(id)) : Promise.reject(new Error('CANT ADD USER IN GROUP'))
  );

const addUserGroup = (id, idGroup) => 
  Groups.findOne({
    where: {
      idGroup
    }
  }).then(group =>
    group ? Promise.resolve(group.addUser(id)) : Promise.reject(new Error('CANT ADD USER IN GROUP'))
  );

const isUserGroup = ({ id, idGroup }) =>
  Groups.findOne({
    where: { idGroup},
  }).then(group => 
    group.hasUser(id)
  );


module.exports = {
  createGroup,
  getGroup,
  deleteUserGroup,
  addUserGroup,
  isUserGroup
};

