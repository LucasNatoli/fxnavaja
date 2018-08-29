'user strict'

module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('account', {
    userid: {
      type: DataTypes.STRING,
      required: true
    },
    name: {
      type: DataTypes.STRING,
      required: true
    },
    phone: {
      type: DataTypes.STRING,
      required: true
    },
    password: {
      type: DataTypes.STRING,
      required: true
    },
    active: {
      type: DataTypes.BOOLEAN, 
      allowNull: false, 
      defaultValue: true 
    }    
  }, {
    paranoid: true
  });
  return Account
}
