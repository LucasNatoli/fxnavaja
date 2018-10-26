const CronJob = require('cron').CronJob;
const db = require('./db')
const coinmarketcapTiker = require('./services/coinmarketcap')
const candlescanner = require('./candlescanner')
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

new CronJob('0 */5 * * * *', function() {
  console.log('coinmacrketcap ticker update');
  var ticker = new coinmarketcapTiker(db)
  ticker.updateTicker()
}, null, true, 'America/Argentina/Buenos_Aires');

new CronJob('*/10 * * * * *', function() {
	candlescanner.scan(scanProfiles)
}, null, true, 'America/Argentina/Buenos_Aires');
