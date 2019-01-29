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

// UpdateAt automatique refresh -> 
const deleteUser = ({ id }) =>
  Users.update( {deletedAt : Date.now() },{
    where: {id},
    returning: true,
    plain: true
  }).then(user => new Promise (
    (resolve,reject) =>  user && !user.deletedAt
      ? resolve(true)
      : reject(new Error('UNKOWN OR DELETED USER'))
  ) 
)

const updateUser = (userCurrent, {firstName, lastName, email, password }) => // pas moyen de passer req.body ?
  Users.update( {firstName, lastName, email, hash : password },{
    where: { id: userCurrent.id},
    returning: true,
    plain: true
  }).then(user => new Promise (
    (resolve,reject) =>  user && !user.deletedAt
      ? resolve(true)
      : reject(new Error('CANT UPDATED USER'))
  ) 
)

module.exports = {
  createUser,
  getUser,
  loginUser,
  deleteUser,
  updateUser
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