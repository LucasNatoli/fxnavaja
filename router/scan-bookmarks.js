'use strict'

module.exports = (app, db) => {
  app.get('/scan-bookmarks', (req, res) => {
   
    var sess = req.session
    if (typeof sess.userid != 'undefined'){
      db.account.findOne({
        where: {userid:sess.userid},
        include: [{model: db.scanBookmark, include: [db.scanProfile, db.trigger]}]
      })
      .then(
        account=>{
          res.json(
            account.scanBookmarks.map(
              bm=>{ 
                return {
                  id: bm.id,
                  active: bm.active, 
                  scanProfile: bm.scanProfile.dataValues,
                  trigger: bm.trigger.dataValues
                }
              }
            )
          )
        },
        err=>{
          res.status(401).send()
        }
      )
    } else {
      res.status(401).send()
    }
  })

  app.post('/scan-bookmarks/', (req, res) => {
 
    var exchange = req.body.scanProfile
    var coin = req.body.coin
    var asset = req.body.asset
    var interval = req.body.interval

    db.scanBookmark.create({
      exchange: exchange,
      coin: coin,
      asset: asset,
      interval: interval,
      limit: limit
    })
    .then(bookmark => {
      res.json(bookmark)
    })
  })
}
