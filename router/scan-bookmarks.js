'use strict'

module.exports = (app, db) => {
  app.get('/scan-bookmarks', (req, res) => {
   
    var sess = req.session
    if (typeof sess.userid != 'undefined'){
      db.account.findOne({where: {userid=sess.userid}})
      .then(
        account=>{
          account.getScanBookmarks
          .then(
            bookmarks=>{res.json(bookmarks)},
            err=>{
              res.status(500)
              console.log('error: ', err)
            }
          )
        }
      )
    } else {
      res.status(401).send()
    }
  })

  // app.post('/scan-bookmarks/', (req, res) => {
 
  //   var exchange = req.body.exchange
  //   var coin = req.body.coin
  //   var asset = req.body.asset
  //   var interval = req.body.interval

  //   db.scanBookmark.create({
  //     exchange: exchange,
  //     coin: coin,
  //     asset: asset,
  //     interval: interval,
  //     limit: limit
  //   })
  //   .then(bookmark => {
  //     res.json(bookmark)
  //   })
  // })
}
