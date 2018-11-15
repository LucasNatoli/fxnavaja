'use strict'

module.exports = (app, db) => {
  app.get('/notifications', (req, res) => {

    var sess = req.session
    if (typeof sess.userid != 'undefined'){
      db.bookmarkNotification.findAll({
        where: {account_id: sess.account_id}
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
}