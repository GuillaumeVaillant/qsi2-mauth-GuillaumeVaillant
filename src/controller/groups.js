const omit = require('lodash.omit');
const { Groups } = require('../model');

const createGroup = ({ firstName, lastName, email, password }) =>
  Groups.create({
    email,
    firstName: firstName || '',
    lastName: lastName || '',
    hash: password
  }).then(user =>
    omit(
      user.get({
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

const addUserGroup = (userCurrent, {firstName, lastName, email, password }) => // pas moyen de passer req.body ?
  Groups.update( {firstName, lastName, email, hash : password },{
    where: { id: userCurrent.id},
    returning: true,
    plain: true
  }).then(user =>
    user && !user.deletedAt
      ? true
    : Promise.reject(new Error('CANT UPDATED USER'))
  );

module.exports = {
  createGroup,
  getGroup,
  deleteUserGroup,
  addUserGroup
};


/*

db.connections.update({
  user: data.username,
  chatroomID: data.chatroomID
}, {
  where: { socketID: socket.id },
  returning: true,
  plain: true
})
.then(function (result) {
  console.log(result);   
  // result = [x] or [x, y]
  // [x] if you're not using Postgres
  // [x, y] if you are using Postgres
});

*/