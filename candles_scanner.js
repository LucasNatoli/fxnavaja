const exchanges = require('./exchanges')
const CandlesStore = require('./candles_store')


//candelabrum
function CandleScanner (profile) {
	this.profile = profile
	this.scan = function () {
		var p = this.profile
		return new Promise(
			(resolve, reject) => {
				exchanges
				.getWarper(p.exchange)
				.getCandles(p.coin, p.asset, p.interval, p.limit)
				.then(
					candles=>{new CandlesStore(p).save(candles)},
					err=>{console.log('error getting candles:', err)}
				)
			}
		)
	}
}


module.exports = CandleScanner

/* 
title Candle read-write Crontab

CandleScanner->CronJobTick: schedule(pattern)
CronJobTick-->CandleScanner: start()
CandleScanner-->Configs: configs = readAll()
loop each config
	CandleScanner->*ExchangeInterface: new(exchange)
	CandleScanner->+ExchangeInterface: fetchCandles()
	ExchangeInterface->ExchangeAPI: GET
	ExchangeInterface->ExchangeInterface: parseOHCLV
	ExchangeInterface-->-CandleScanner: <OHCLV>candles[ ]
	CandleScanner->CandleScanner: saveCandles()
	destroy ExchangeInterface
end 
*/