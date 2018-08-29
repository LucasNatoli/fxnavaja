'user strict'

module.exports = (sequelize, DataTypes) => {
  const AlarmSuscription = sequelize.define('alarmSuscription', {
    active: {
      type: DataTypes.BOOLEAN, 
      allowNull: false, 
      defaultValue: true 
    }
  }, {
    paranoid: true
  });
  return AlarmSuscription
}
