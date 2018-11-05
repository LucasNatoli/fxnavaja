'user strict'

module.exports = (sequelize, DataTypes) => {
  const ScanProfile = sequelize.define('scanProfile', {
    exchange: {
      type: DataTypes.STRING,
      required: true
    },
    coin: {
      type: DataTypes.STRING,
      required: true
    },
    asset: {
      type: DataTypes.STRING,
      required: true
    },
    interval: {
      type: DataTypes.STRING,
      required: true
    },
    limit: {
      type: DataTypes.INTEGER,
      required: true
    }
  }, {
    paranoid: true
  });
  return ScanProfile
}
