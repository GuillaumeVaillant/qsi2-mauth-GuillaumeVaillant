module.exports = (sequelize, DataTypes) => {
  const Groups = sequelize.define(
    'Groups',
    {
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
  return Groups;
};
