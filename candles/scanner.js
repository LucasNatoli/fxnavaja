const exchanges = require('../exchanges')
const CandlesStore = require('./store')

//candelabrum
function Scanner (profile) {
	this.profile = profile
	this.scan = function (count) {
		var p = this.profile
    exchanges
    .getWarper(p.exchange)
    .getCandles(p.coin, p.asset, p.interval, count)
    .then(
      candles=>{new CandlesStore(p).save(candles)},
      err=>{console.log('error getting candles:', err)}
    )
	}
}

module.exports = Scanner