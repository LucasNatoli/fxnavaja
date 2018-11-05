'use strict' 

const CronJob = require('cron').CronJob;
const db = require('./db')
const coinmarketcapTiker = require('./services/coinmarketcap')
const candlesScanner = require('./candles/scanner')

new CronJob('0 */5 * * * *', function() {
  var ticker = new coinmarketcapTiker(db)
  ticker.updateTicker()
}, null, true, 'America/Argentina/Buenos_Aires')

new CronJob('*/60 * * * * *', function() {
	db.scanProfile.findAll()
	.then(
		profiles=>{
			profiles.forEach(profile => {
				new candlesScanner(profile).scan(profile.limit)
			});
		}
	)
}, null, true, 'America/Argentina/Buenos_Aires')
