'use strict'

module.exports = (app, db) => {
  app.get('/alarms', (req, res) => {
    db.alarm.findAll()
      .then(alarms => {
        res.json(alarms)
      })
  })

  app.get('/alarms/suscribe/:id', (req, res) => {
    var id = req.params.id
    db.alarmSuscription.create({
      active: true,
      alarm_id: id,
      account_id: 1
    })
    .then(suscription => {
      res.json({
        suscription_id: suscription.id
      })
    })
  })
}
