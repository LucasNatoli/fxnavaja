const axios = require('axios')

const baseEndpoint = 'https://bittrex.com/Api/v2.0/'

function queryExchange (endpoint, params){
  return new Promise(
    (resolve, reject) => {
      axios.get(baseEndpoint + endpoint, {
        headers: {
          'content-type': 'application/json'
        },
        params: params
      }).then(
        (response) => {
          resolve(response)
        },
        (err) => {
          reject(err);
        }
      )
    }
  ) 
}

function Bittrex() {
  this.db = 'bittrex',
  this.intervals = ['oneMin', 'fiveMin', 'thirtyMin', 'hour', 'day']
}

Bittrex.prototype.getCandles = (coin, asset, interval, limit) => {
  var apiUrl = 'pub/market/GetTicks?marketName=' + coin + '-' + asset + '&tickInterval=' + interval

  return new Promise(
    (resolve, reject) => {
      queryExchange('pub/market/GetTicks', {
        marketName: coin + '-' + asset,
        tickInterval: interval
      })
      .then(
        (res)=>{
          if (res.status === 200) {
            if (res.data.success===true){
              var candles
              if(res.data.result.length > limit) { 
                candles = res.data.result.slice(limit*-1, res.data.result.length)
              } else {
                candles = res.data.results
              }
              resolve(
                candles.map(
                  (candle) => {
                    var unixTime = new Date(candle.T).getTime() / 1000
                    return {T: unixTime, O: candle.O, H: candle.H, L: candle.L, C: candle.C, V: candle.V}
                  }
                )
              )
            } else {
              reject(res)
            }
          } else {
            reject(res)
          }
        },
        (err) => {
          reject(err)
        }
      )
    }
  )
}
module.exports = new Bittrex()