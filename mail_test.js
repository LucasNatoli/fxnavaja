'use stirct'

const nodemailer = require('nodemailer')
const env = process.env

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.MAIL_FROM,
    pass: env.MAIL_PASSWORD
  }
})

var newMail = {
  from: env.MAIL_FROM,
  to: n.bookmark.account.userid,
  subject: 'Test',
  text: 'Testing'
}

transporter.sendMail(newMail, (error, info) =>{
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
    n.sent =true
    n.save()
  }
})        