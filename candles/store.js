const env = process.env

const Sequelize = require('sequelize')
const Op = Sequelize.Op
const candleModel = {
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
      var model = db.define(tableName, candleModel, {paranoid: false})  
      db.sync({force: false})
      .then(
        ()=>{resolve(model)},
        (err)=>{reject(err)}
      )
    }
  )
}

function parseRows(rows) {
  //si no usara parseFloat las propiedades de la vela que devuelve son Strings (?)
  return rows.map(r => {
    return {
      O: parseFloat(r.O), H: parseFloat(r.H), L: parseFloat(r.L), 
      C: parseFloat(r.C), V: parseFloat(r.V), T: parseFloat(r.T)
    }
  })
}

function readCandles(tableName, options) {
  return new Promise(
    (resolve, reject) => {
      syncModel(tableName)
      .then(
        model => {
          model.findAll(options)
          .then(
            rows => {resolve(parseRows(rows))},
            err => {reject(err)}
          )        
        },
        err=>{reject(err)}
      )      
    }
  )
}

function writeCandlesToTable(tableName, candles) {

  syncModel(tableName)
  .then(
    (model) => {
      model
      .destroy({where: {T: {[Op.between]: [candles[0].T, candles[candles.length-1].T]}}})           
      .then( 
        ()=>{
          model
          .bulkCreate(candles)
          .then(
            affectedRows =>{},
            err=> {console.log(err)}
          )
        }, 
        (err) => {console.log('error destroying:', err)}

        // (rowCount) => {
        //   candles.map(
        //     (candle) => {
        //       model
        //         .build({O: candle.O, H: candle.H, L: candle.L, C:candle.C, V: candle.V, T: candle.T})
        //         .save()
        //         .catch(err => {console.log('error saving:', err)})
        //     }
        //   )
        // }, 
        // (err) => {console.log('error destroying:', err)}
      )
    }
  )
}

function Store(profile){

  this.profile = profile
  this.tableName = profile.exchange + '_' + profile.coin + '_' + profile.asset + '_' + profile.interval
  this.save = (candles) => {writeCandlesToTable(this.tableName, candles)}
  this.readAll = () => {return readCandles(this.tableName)}
  this.readFirst = limit => {return readCandles(this.tableName, {limit: limit})}
  this.readLast = (limit) => {
    return new Promise(
      (resolve, reject) =>{
        readCandles(this.tableName, {limit: limit, order: [['T', 'DESC']]})
        .then(
          candles => {resolve(candles.sort((a,b)=>{return a.T - b.T}))},
          err => {reject(err)}
        )
      }
    ) 
  }
  return this
}

module.exports = Store