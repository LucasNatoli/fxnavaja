'use strict' 

const CronJob = require('cron').CronJob;
const db = require('./db')
const Scanner = require('./candles/scanner')
const Store = require('./candles/store')
const Analyzer = require('./candles/analyzer')

const checkBookmark = bookmark => {

  new Store(bookmark.scanProfile)
  .readAll()
  .then(
    candles => {
			var model = {active:true, bookmark_id: bookmark.id}
      if (new Analyzer(candles, bookmark.trigger).check()===true) {
				console.log('creating notification', bookmark.scanProfile.coin, bookmark.scanProfile.asset, bookmark.scanProfile.interval)
				db.bookmarkNotification
				.findOrCreate(
					{ 
						where: model,
						defaults: model
					}
				)
      }
    },
    err=> {console.log('error', err)}
  )
}

const getBookmarksByProfileId = id => {
  return new Promise(
    (resolve, reject) => {
      db.bookmark.findAll({
        where: {scan_profile_id: id},
        include: [db.scanProfile, db.trigger]
      })
      .then(
        bookmarks => {resolve(bookmarks)},
        err=> {reject(err)}
      )      
    }
  )
}

const allSteps = () => {
	console.log('all Steps running')
	db.scanProfile.findAll()
	.then(
		profiles=>{
			profiles.forEach(
				profile=> {
					new Scanner(profile)
					.scan(profile.limit)
					.then(
						candles => {
							//I'm ignoring the scanned candles since an indicator might need a larger amount to calculate
							getBookmarksByProfileId(profile.id)
							.then (
								bookmarks=> {
									bookmarks.forEach(b=> {checkBookmark(b)})
								}
							)						
						},
						err => {console.log('error scanning', err)}
					)
				}
			)
		}
	)
}

new CronJob(
	'10 */1 * * * *', 
	() => {allSteps()}, 
	null, 
	true, 
	'America/Argentina/Buenos_Aires'
)

//const coinmarketcapTiker = require('./services/coinmarketcap')

// new CronJob('0 */5 * * * *', function() {
//   var ticker = new coinmarketcapTiker(db)
//   ticker.updateTicker()
// }, null, true, 'America/Argentina/Buenos_Aires')
