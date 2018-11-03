const env = process.env;
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const OHLCV = {
  O: {
    type: Sequelize.DECIMAL(18, 8),
    required: true
  },
  H: {
    type: Sequelize.DECIMAL(18, 8),
    required: true
  },
  L: {
    type: Sequelize.DECIMAL(18, 8),
    required: true
  },
  C: {
    type: Sequelize.DECIMAL(18, 8),
    required: true
  },
  V: {
    type: Sequelize.DECIMAL(18, 8),
    required: true
  },
  T: {
    type: Sequelize.INTEGER,
    required: true,
    primaryKey: true
  }             
}
const MYSQL_CONNECTION = 
{
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'mysql',
    define: {
        underscored: true
    },
    logging: false
}

function syncModel(tableName) {  
  return new Promise(
    (resolve, reject) => {
      var db = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, MYSQL_CONNECTION)
      var model = db.define(tableName, OHLCV, {paranoid: false})  
      db.sync({force: false})
      .then(
        ()=>{resolve(model)},
        (err)=>{reject(err)}
      )
    }
  )
}

function readCandles(tableName, limit) {
  return new Promise(
    (resolve, reject) => {
      syncModel(tableName)
      .then(
        model =>{
          model.findAll({limit: limit})
          .then(
            rows=> {
              //si no usara parseFloat las propiedades de la vela que devuelve son Strings (?)
              resolve(rows.map(r => {
                return {
                  O: parseFloat(r.O), 
                  H: parseFloat(r.H), 
                  L: parseFloat(r.L), 
                  C: parseFloat(r.C), 
                  V: parseFloat(r.V), 
                  T: parseFloat(r.T)
                }
              }))
            },
            err=>{reject(err)}
          )
        }
      )
    }
  )
}

function writeCandlesToTable(tableName, candles) {

  syncModel(tableName)
  .then(
    (model) => {
      model.destroy({where: {T: {[Op.between]: [candles[0].T, candles[candles.length-1].T]}}})           
      .then(
        (rowCount) => {
          candles.map(
            (candle) => {
              model
                .build({O: candle.O, H: candle.H, L: candle.L, C:candle.C, V: candle.V, T: candle.T})
                .save()
                .catch(err => {console.log('error saving:', err)})
            }
          )
        }, 
        (err) => {console.log('error destroying:', err)}
      )
    }
  )
}

function CandlesStore(profile){
  this.profile = profile
  var s = this.profile
  this.tableName = s.exchange + '_' + s.coin + '_' + s.asset + '_' + s.interval
  this.save = (candles) => {writeCandlesToTable(this.tableName, candles)}
  this.read = (limit) => {return readCandles(this.tableName, limit)}
  return this
}

module.exports = CandlesStore