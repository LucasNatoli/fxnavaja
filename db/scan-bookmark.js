'user strict'

module.exports = (sequelize, DataTypes) => {
  const ScanBookmark = sequelize.define('scanBookmark', {
    active: {
      type: DataTypes.BOOLEAN, 
      allowNull: false, 
      defaultValue: true 
    }
  }, {
    paranoid: true
  });
  return ScanBookmark
}
