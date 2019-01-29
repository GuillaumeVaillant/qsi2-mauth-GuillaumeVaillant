module.exports = (sequelize, DataTypes) => {
  const Groups = sequelize.define(
    'Groups',
    {
      idGroup: {
      // Avoid usage of auto-increment numbers, UUID is a better choice
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      comment: 'group ID',
      primaryKey: true
    },
      title: {
        type: DataTypes.STRING,
        comment: 'group title'
      },
      description: {
        type: DataTypes.STRING,
        comment: 'description'
      },
      metadata: {
        type: DataTypes.JSONB,
        // Not null management
        allowNull: false,
        comment: 'metadata'
      }
    }
  );

  Groups.associate = modeles => {
    Groups.belongsToMany(modeles.Users, {through: 'UsersGroup'});
    Groups.belongsTo(modeles.Users, { as: 'GroupAdmin' }); // gestion des rôles
  }

  /*
  Du coup dans la nouvelle table 
  grouidgroup = id du groupe 
  userid = admin du groupe
  */
  return Groups;
};
