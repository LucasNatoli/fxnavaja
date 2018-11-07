'user strict'

module.exports = (sequelize, DataTypes) => {
  const Trigger = sequelize.define('trigger', {
    name: {
      type: DataTypes.STRING,
      required: true
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
  return Trigger
}
