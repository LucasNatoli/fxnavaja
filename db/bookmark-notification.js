'user strict'

module.exports = (sequelize, DataTypes) => {
  const BookmarkNotification = sequelize.define('bookmarkNotification', {
    active: {
      type: DataTypes.BOOLEAN, 
      allowNull: false, 
      defaultValue: true 
    }
  }, {
    paranoid: true
  });
  return BookmarkNotification
}