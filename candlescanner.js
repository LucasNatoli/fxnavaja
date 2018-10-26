const exchanges = require('./exchanges')

function fecth (profile) {

	var exchange = exchanges.getWarper(profile.exchange)
	var store = require('./candlestore')	
	exchange.getCandles(profile.coin, profile.asset, profile.interval, profile.limit)
	.then(
		(candles) => {
			store.saveCandles(profile.exchange, profile.coin, profile.asset, profile.interval, candles)
			.then(
				(ok)=> {
					//calcular indicadores
					//actualizar indicadores
					//evaluar estrategia indicadores
				},
				(err)=>{
					console.log('error ocurred:', profile.exchange, profile.coin, profile.asset, profile.interval)
				}
			)
		},
		(err) => {
			console.log(err)
		}
	)
}
function CandleScanner () {}

CandleScanner.prototype.scan = 
	(profiles) => {
		profiles.forEach(
			(profile) =>
			fecth(profile)
		)
	}

	module.exports = new CandleScanner()

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