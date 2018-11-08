'user strict'

module.exports = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define('bookmark', {
    active: {
      type: DataTypes.BOOLEAN, 
      allowNull: false, 
      defaultValue: true 
    }
  }, {
    paranoid: true
  });
  return Bookmark
}
