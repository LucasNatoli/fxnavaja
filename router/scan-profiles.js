'use strict'

module.exports = (app, db) => {
  app.get('/scan-profiles', (req, res) => {
    db.scanProfile
    .findAll()
    .then(
      profiles => {
        res.json(profiles)
      }
    )
  })

  app.post('/scan-profiles/', (req, res) => {
    
    var exchange = req.body.exchange
    var coin = req.body.coin
    var asset = req.body.asset
    var interval = req.body.interval
    var limit = req.body.limit

    db.scanProfile.create({
      exchange: exchange,
      coin: coin,
      asset: asset,
      interval: interval,
      limit: limit
    })
    .then(profile => {
      res.json(profile)
    })
  })
}
