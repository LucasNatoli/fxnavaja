const sqlite3 = require('sqlite3').verbose();
const CANDLES_TABLE = 'candles'


function init (exchange, coin, asset, interval) {
  var dbname = exchange + '_' + coin + asset + '_' + interval + '.db'
  return new Promise(
    (resolve, reject) => {
      db = new sqlite3.Database(
        './candles/' + dbname, 
        (err) => {
          if(err) {
            reject(err)
          }
          resolve(db)
        }
      ) 
    }
  )
}

function ensureCandlesTable (db) {
  var sql = "CREATE TABLE if not exists `Candles` (`O`	NUMERIC NOT NULL, `H`	NUMERIC NOT NULL, `L`	NUMERIC NOT NULL, `C`	NUMERIC NOT NULL, `V`	NUMERIC NOT NULL, `T`	INTEGER NOT NULL, PRIMARY KEY('T'));"
  return new Promise(
    (resolve, reject) => {
      db.run(sql, (err) => {
        if (err) { reject(err)}
        resolve(true)
      })
    }
  )
}

function deleteCandles(db, from, to) {
  return new Promise(
    (resolve, reject) =>{
      var sql = "DELETE FROM Candles WHERE T BETWEEN ? AND ?"
      db.run(sql,[from, to], (err)=>{
        if(err) {reject(err)}
        resolve(true)
      })      
    }
  )

}

function CandleStore () {}

CandleStore.prototype.saveCandles = (exchange, coin, asset, interval, candles) => {

  return new Promise(
    (resolve, reject) => {
  
      init(exchange, coin, asset, interval).then(
        (db)=>{
          ensureCandlesTable(db, CANDLES_TABLE).then(
            (result) => {
              deleteCandles(db, candles[0].T, candles[candles.length-1].T).then(
                (ok)=> {
                  var sql = "INSERT INTO Candles (O, H, L, C, V, T) VALUES (?, ?, ?, ?, ?, ?)"
                  
                  db.serialize(()=>{
                    var stmt = db.prepare(sql)
                    candles.forEach(
                      (candle) => {
                        stmt.run(
                          [candle.O, candle.H, candle.L, candle.C, candle.V, candle.T],
                          (err, rows) => {
                            if(err) {
                              reject(err)
                            } 
                          }
                        )
                      }
                    )
                    stmt.finalize(
                      (err) => {
                        if(err) { 
                          console.log('stmt finalize error')
                          reject(err) 
                        }
                      }
                    )
                  })
                  resolve(true)
                },
                (err) => {
                  console.log("DELETE CANDLES ERROR")
                  reject(err)
                }
              )
            },
            (err) => {
              console.log('ENSURE CANDLES TABLES ERROR:')
              reject(err)
            }
          )
        },
        (err)=>{
          console.log('INITDB ERROR')
          reject(err)
        }
      )
    }
  )

}  

module.exports = new CandleStore()

/*

db = init(exchange, coin, asset, interval) 
db.candlesTableExists
db.ensureCandlesTable()
db.saveCandles(candles)
db.getLastCandles(count)
db.getCandles(from, to)
db.getCandles(from, count)


*/