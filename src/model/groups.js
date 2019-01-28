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
        type: DataTypes.JSON,
        // Not null management
        allowNull: false,
        comment: 'metadata'
      }
    }
  );

  Groups.associate = modeles => Groups.belongsToMany(modeles.Users, {through: 'UsersGroup'});

  return Groups;
};
