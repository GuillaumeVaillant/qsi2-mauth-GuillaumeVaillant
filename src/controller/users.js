const omit = require('lodash.omit');
const { Users } = require('../model');

const createUser = ({ firstName, lastName, email, password }) =>
  Users.create({
    email,
    firstName: firstName || '',
    lastName: lastName || '',
    hash: password
  }).then(user =>
    omit(
      user.get({
        plain: true
      }),
      Users.excludeAttributes
    )
  );

const loginUser = ({ email, password }) =>
  Users.findOne({
    where: {
      email
    }
  }).then(user =>
    user && !user.deletedAt
      ? Promise.all([
          omit(
            user.get({
              plain: true
            }),
            Users.excludeAttributes
          ),
          user.comparePassword(password)
        ])
      : Promise.reject(new Error('UNKOWN OR DELETED USER'))
  );

const getUser = ({ id }) =>
  Users.findOne({
    where: {
      id
    }
  }).then(user =>
    user && !user.deletedAt
      ? omit(
          user.get({
            plain: true
          }),
          Users.excludeAttributes
        )
      : Promise.reject(new Error('UNKOWN OR DELETED USER'))
  );

// UpdateAt automatique refresh 
const deleteUser = ({ id }) =>
  Users.update( {deletedAt : Date.now() },{
    where: {id},
    returning: true,
    plain: true
  }).then(user =>
    user && !user.deletedAt
      ? true
    : Promise.reject(new Error('CANT DELETED USER'))
  );

module.exports = {
  createUser,
  getUser,
  loginUser,
  deleteUser
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