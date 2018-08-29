'use strict';
const credential = require('credential')

function hashPassword (password) {
  return new Promise((resolve, reject) => {
    var pw = credential()
    pw.hash(password, (err, hash)=>{

      if (err) {
        reject(err)
      }else{
        resolve(hash)
      }
    })
  })
}

function verifyPassword(hash, password) {
  return new Promise(function(resolve, reject) {
    var pw = credential()
    pw.verify(hash, password, (err, isValid)=>{
      if (err) {
        reject(err)
      }else {
        resolve(isValid)
      }
    })
  })
}

function findByUserId(userid, account){
  return new Promise(function(resolve, reject) {
    account.findOne({
      where: {userid: userid}
    }).then(
      account => {
        resolve(account)
      },
      err => {
        reject(err)
      }
    )
  })
}


module.exports = (app, db) => {
  
  app.post('/accounts/register', (req, res) => {

    //TODO: buscar una manera de mapear esto a un json para poder usarlo en el create
    var userid = req.body.userid
    var name = req.body.name
    var phone = req.body.phone
    var password = req.body.password
    
    findByUserId(userid, db.account).then(
      account => {
        if(account){
          // El userid ya existia
          res.status(401).send() //TODO: Investigar que codigo de error se devuelve por account publicada
        } else {
          hashPassword(password).then(
            (hashedPassword)=>{
              db.account.create({
                userid: userid,
                name: name,
                phone: phone,
                password: hashedPassword
              }).then(account => {
                res.status(200).end()
              })
            },
            (err)=>{
              console.log(err)
              res.status(500).send
            }
          )
        }
      }
    )
  })

  app.post('/accounts/login', (req, res) =>{
    
    var userid = req.body.userid;
    var password = req.body.password
    findByUserId(userid, db.account).then(
      account => {
        if (account) {
          var storedHash = account.get('password')
          verifyPassword(storedHash, password).then(
            result => {
              if (result) {
                var sess = req.session
                sess.userid = userid
                sess.name = account.name
                sess.save
                var userInfo = {
                  userid : userid,
                  name : account.name
                }                
                res.status(200).send(JSON.stringify(userInfo))
              } else {
                // No coincide el password
                res.status(401).send()
              }
            },
            err => {
              // No se puedo verificar el hash
              res.status(500).send()
            }
          )
        } else {
          // No existe el userid en la base de datos
          res.status(401).send()
        }
      },
      err => {
        // No se pudo hacer la busqueda en la base de datos
        console.log(err);
        res.status(500).send()
      }
    )
  })

  app.get('/accounts/logout', (req, res) => {

    var sess = req.session
    if (sess) {
      sess.destroy()
    }
    res.status(200).send()
  })

  app.get('/accounts/check', (req, res) => {
    var sess = req.session
    if (typeof sess.userid != 'undefined'){
      var userInfo = {
        userid : sess.userid,
        name : sess.name
      }                
      res.status(200).send(JSON.stringify(userInfo))      
    } else {
      res.status(401).send()
    }
  })
}
