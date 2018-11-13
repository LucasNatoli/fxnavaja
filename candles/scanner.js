const exchanges = require('../exchanges')
const CandlesStore = require('./store')

//candelabrum
function Scanner (profile) {
	this.profile = profile
	this.scan = function (count) {
    return new Promise(
      (resolve, reject) => {
        var p = this.profile
        exchanges
        .getWarper(p.exchange)
        .getCandles(p.coin, p.asset, p.interval, count)
        .then(
          candles=>{
            new CandlesStore(p)
            .save(candles)
            .then(
              rowsAffected => {
                resolve(candles)
              },
              err=> {reject(err)}
            )
          },
          err=> {reject(err)}
        )
      }
    )
	}
}

module.exports = Scanner