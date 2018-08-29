
const axios = require("axios");
const tickerUrl = "https://api.coinmarketcap.com/v1/ticker/?limit=10";
const db = require('../db')


function getTicker(){
  return new Promise(function(resolve, reject) {
    axios.get(tickerUrl).then(
        function(response){
            resolve(response.data);
        },
        function(err){
            console.log(err);
            reject(err);
        }
    )
  });  
}

function updateTicker(db){

  getTicker().then(
    data=> {
      if (data.length>0) {
 /*        db.coinmarketcapTick.destroy({
          where: {},
          truncate: true
        }) */

        for(var i=0; i<data.length; i++){
          var t = data[i]
          db.coinmarketcapTick
          .findOrCreate({
            where: {
              market_id: t.id, 
              last_updated: t.last_updated
            }, 
            defaults: {
              market_id: t.id,
              symbol: t.symbol,
              last_updated: t.last_updated,
              name: t.name,
              rank: t.rank,
              price_usd: t.price_usd,
              price_btc: t.price_btc,
              vol_24h_usd: t['24h_volume_usd'],
              market_cap_usd: t.market_cap_usd,
              available_supply: t.available_supply,
              total_supply: t.total_supply ,
              max_supply: t.max_supply,
              percent_change_1h: t.percent_change_1h,
              percent_change_24h: t.percent_change_24h,
              percent_change_7d: t.percent_change_7d
            }
          })
          .spread((tick, created)=> {
            if (created) console.log(tick.get({plain:true}))
          })
        }
      }
    },
    err => {
      console.error(err)
    }
  )  
}


db.sequelize.sync(
  /* {force: true} */
).then(() => {
  console.log('db sync ok')


  updateTicker(db)
})