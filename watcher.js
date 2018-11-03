'use strict' 

const CronJob = require('cron').CronJob;
const db = require('./db')
const coinmarketcapTiker = require('./services/coinmarketcap')
const candlesScanner = require('./candles_scanner')
const candlesAnalyzer = require('./candles_analyzer')
const scanProfiles = [
	{
		exchange: 'bittrex',
		coin: 'BTC',
		asset: 'ETH',
		interval: 'oneMin',
		limit: 10
	}
	,
	{
		exchange: 'bittrex',
		coin: 'BTC',
		asset: 'ETH',
		interval: 'hour',
		limit: 10
	}
	,
	{
		exchange: 'bittrex',
		coin: 'BTC',
		asset: 'RDD',
		interval: 'hour',
		limit: 10
	}
	,
	{
		exchange: 'binance',
		coin: 'BTC',
		asset: 'ETH',
		interval: '1m',
		limit: 10
	}
	,
	{
		exchange: 'binance',
		coin: 'BTC',
		asset: 'ETH',
		interval: '5m',
		limit: 10
	}
	,
	{
		exchange: 'binance',
		coin: 'BTC',
		asset: 'MCO',
		interval: '1m',
		limit: 10
	}
]


var bollingerSample = 'BB_C_20_2_lower'
var mfiSample = 'MFI'
var emaSample = 'EMA_C_9'

new CronJob('0 */5 * * * *', function() {
  var ticker = new coinmarketcapTiker(db)
  ticker.updateTicker()
}, null, true, 'America/Argentina/Buenos_Aires')

new CronJob('*/60 * * * * *', function() {
	scanProfiles.forEach(
		(profile) => {
			new candlesScanner(profile).scan()
			//new candlesAnalyzer(profile).analyze(bollingerSample)
		}
	)	
}, null, true, 'America/Argentina/Buenos_Aires')
