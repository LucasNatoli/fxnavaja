const Store = require('./store')
const Scanner = require('./scanner')
const profile = {
  exchange: 'bittrex',
  coin: 'BTC',
  asset: 'ETH',
  interval: 'fiveMin'
}

new Scanner(profile).scan(20)

var s = new Store(profile)
s.readAll().then(allCandles => {console.log('read all count:', allCandles.length)})
s.readFirst(2).then(firstTwo => {console.log('First 2 rows Times', firstTwo.map(c=>{return c.T}))})
s.readLast(5).then(lastFive => {console.log('last five Times:', lastFive.map(c=>{return c.T}))})
