'user strict'

module.exports = (sequelize, DataTypes) => {
  const Alarm = sequelize.define('alarm', {
    name: {
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
    candleSize: {
      type: DataTypes.ENUM,
      values: ['oneMin', 'fiveMin', 'oneHour']
    },
    termA: {
      type: DataTypes.STRING,
      required: true
    },
    termB: {
      type: DataTypes.STRING,
      required: true
    },
    operator: {
      type: DataTypes.ENUM,
      values: ['lessOrEqual', 'greaterOrEqual', 'equals']
    }
  }, {
    paranoid: true
  });
  return Alarm
}
