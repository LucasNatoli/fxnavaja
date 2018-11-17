'use strict'

module.exports = (app, db) => {
  app.get('/bookmarks', (req, res) => {
   
    var sess = req.session
    if (typeof sess.userid != 'undefined'){
      db.account.findOne({
        where: {userid:sess.userid},
        include: [{model: db.bookmark, include: [db.scanProfile, db.trigger]}]
      })
      .then(
        account=>{
          res.json(
            account.bookmarks.map(
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

  app.post('/bookmarks/', (req, res) => {
 
    var sess = req.session
    var triggerId = req.body.trigger
    var defaultProfile = {
      exchange: req.body.exchange,
      coin: req.body.coin,
      asset: req.body.asset,
      interval: req.body.interval
    }
    
    if (typeof sess.userid != 'undefined'){
      db.account.findOne({
        where: {userid:sess.userid}
      })
      .then(
        account => {
          db.scanProfile.findOrCreate({
            where: defaultProfile,
            defaults: defaultProfile
          })
          .spread(
            (profile, created) => {
              db.bookmark.create({
                scan_profile_id: profile.id,
                trigger_id: triggerId,
                account_id: account.id,
                active: true      
              })
              .then(bookmark => {
                res.json(bookmark.dataValues)
              })

              if (created) {
                //TODO: Check this default. shoul be in model definition?
                profile.limit = 20
                profile.save()
              }
            }
          )
        }
      )
    }
  })
}
