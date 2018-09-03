const CronJob = require('cron').CronJob;
const db = require('./db')
const coinmarketcapTiker = require('./services/coinmarketcap')


new CronJob('0 */5 * * * *', function() {
  console.log('coinmacrketcap ticker update');
  var ticker = new coinmarketcapTiker(db)
  ticker.updateTicker()
}, null, true, 'America/Argentina/Buenos_Aires');