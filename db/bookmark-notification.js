'user strict'

module.exports = (sequelize, DataTypes) => {
  const BookmarkNotification = sequelize.define('bookmarkNotification', {
    active: {
      type: DataTypes.BOOLEAN, 
      allowNull: false, 
      defaultValue: true 
    },
    sent: {
      type: DataTypes.BOOLEAN, 
      allowNull: false, 
      defaultValue: false 
    }
  }, {
    paranoid: false
  });
  return BookmarkNotification
}