'use stirct'
const db = require('../db')
const nodemailer = require('nodemailer')
const env = process.env

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.MAIL_FROM,
    pass: env.MAIL_PASSWORD
  }
})

db.bookmarkNotification
.findAll({
  where: {sent: false},
  include: [{model: db.bookmark, include: [db.scanProfile, db.account]}]
})
.then(
  notifications => {
    notifications.forEach(
      n => {
        
        var mailOptions = {
          from: env.MAIL_FROM,
          to: n.bookmark.account.userid,
          subject: 'Señal activada: ' + n.bookmark.scanProfile.exchange 
            + ': ' + n.bookmark.scanProfile.coin 
            + '-' + n.bookmark.scanProfile.asset,
          text: 'Señal: ' 
            + n.bookmark.scanProfile.exchange 
            + ': ' + n.bookmark.scanProfile.coin 
            + '-' + n.bookmark.scanProfile.asset
            + ' (' + n.bookmark.scanProfile.interval + ')'
        }
        
        transporter.sendMail(mailOptions, (error, info) =>{
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            n.sent =true
            n.save()
          }
        })        
      }
    )
  }
)