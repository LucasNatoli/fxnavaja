const env = process.env
const Sequelize = require('sequelize')
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
)

var db = {};

db.Sequelize = Sequelize
db.sequelize = sequelize

//Models
db.account = require('./account')(sequelize, Sequelize)
db.coinmarketcapTick = require('./coinmarketcap_tick')(sequelize, Sequelize)
db.scanProfile = require('./scan-profile')(sequelize, Sequelize)
db.trigger = require('./trigger')(sequelize, Sequelize)
db.bookmark = require('./bookmark')(sequelize, Sequelize)
db.bookmarkNotification = require('./bookmark-notification')(sequelize, Sequelize)

//account scan bookmarks
db.account.hasMany(db.bookmark)
db.bookmark.belongsTo(db.account)
db.bookmark.belongsTo(db.scanProfile)
db.bookmark.belongsTo(db.trigger)

//bbokmark notifications
db.bookmark.hasMany(db.bookmarkNotification)
db.bookmarkNotification.belongsTo(db.bookmark)

module.exports = db;
