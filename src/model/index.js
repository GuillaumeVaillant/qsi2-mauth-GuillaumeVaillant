const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const db = {};
const basename = path.basename(module.filename);

const sequelize = new Sequelize(process.env.DATABASE_URL);
fs.readdirSync(__dirname)
  .filter(
    file =>
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('triggers') === -1
  )
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/*
db.groups = require('./groups')(sequelize, Sequelize); 
db.users = require('./users')(sequelize, Sequelize); 

db.groups.belongsToMany(db.users, {through: 'UsersGroup'});
db.users.belongsToMany(db.groups, {through: 'UsersGroup'});
*/

module.exports = db;
