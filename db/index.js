const env = process.env;
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    env.DB_NAME,
    env.DB_USER,
    env.DB_PASSWORD,
    {
        host: env.DB_HOST,
        port: env.DB_PORT,
        dialect: 'mysql',
        define: {
            underscored: true
        },
        logging: false
    }
);

var db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models
db.alarm = require('./alarm')(sequelize, Sequelize)
db.alarmSuscription = require('./alarm-suscription')(sequelize, Sequelize)
db.account = require('./account')(sequelize, Sequelize)
db.coinmarketcapTick = require('./coinmarketcap_tick')(sequelize, Sequelize)
db.scanProfile = require('./scan-profile')(sequelize, Sequelize)
//relations
db.alarm.hasMany(db.alarmSuscription)
db.alarmSuscription.belongsTo(db.alarm)

db.account.hasMany(db.alarmSuscription)
db.alarmSuscription.belongsTo(db.account)


module.exports = db;
