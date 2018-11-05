const PORT = process.env.PORT
const express = require('express')
const app = express()
const router = require('./router')
const bodyParser = require('body-parser')
const session = require('express-session')
const sqLiteStore = require('connect-sqlite3')(session)

const db = require('./db')

app.use(express.static('web'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session(
  {
    store: new sqLiteStore({dir: 'sqlite3', db: 'sess.db'}),
    secret: 'b?~@Q8*h]m_.C#$5',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
  }
))

router(app, db)

db.sequelize
.sync()
.then(() => {
  console.log("db authentication ok")
  app.listen(PORT, () => console.log('r4Z0R listening on port ', PORT))
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});

/* 
db.sequelize.sync(
  {force: false}
).then(() => {
  console.log("db syn ok")
  app.listen(PORT, () => console.log('r4Z0R listening on port ', PORT))
}) */