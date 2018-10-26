const axios = require('axios')
const baseEndpoint = "https://api.binance.com" 

function queryExchange (endpoint, params){
  return new Promise(
    (resolve, reject) => {
      axios.get(baseEndpoint + endpoint, {
        headers: {
          'content-type': 'application/json'
        },
        params: params
      }).then(
        (res) => {
          resolve(res)
        },
        (err) => {
          reject(err);
        }
      )
    }
  ) 
}


function Binance() {
  this.db = 'binance',
  this.intervals = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M']
}

Binance.prototype.getCandles = function (coin, asset, interval, limit) {
  return new Promise(
    (resolve, reject) => {
      queryExchange('/api/v1/klines', {
        symbol: asset + coin,
        interval: interval,
        limit: limit
      })
      .then(
        (res)=>{
          if (res.status===200) {
            resolve(
              res.data.map(
                (current)=>{
                  var unixTime = current[0] / 1000
                  return {T: unixTime, O: current[1], H: current[2], L: current[3], C: current[4], V: current[5]}
                }
              )
            )
          } else {
            reject(res.status)
          }
        },
        (err) => {
          console.log(err)
          reject(err)
        }
      )
    }
  )
}


module.exports = new Binance()