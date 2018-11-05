const Indicator = require('../utils/indicator')
const Calc = require('../utils/calc')
const Store = require('./store')
const Operators = require('./operators')

const profile = {
  exchange: 'bittrex',
  coin: 'BTC',
  asset: 'ETH',
  interval: 'fiveMin'
}

var strat = {
  termA : 'L',
  termB : 'BB_C_20_2_lower',
  operator : 'lessOrEqual'
}

var s = new Store(profile)

function Analyzer(candles, strategy){
  this.candles = candles
  this.strategy = strategy
  this.valueA
  this.valueB
  this.lastCandle = () => {
    return this.candles[this.candles.length-1]
  }
  this.run = () => {
    var s = this.strategy
    console.log('running', s)
    if (Calc.isIndicator(s.termA)) {
      this.candles = Indicator.parse(s.termA).applyTo(this.candles)
    }
    if (Calc.isIndicator(s.termB)) {
      this.candles = Indicator.parse(s.termB).applyTo(this.candles)
    }
    this.valueA = this.lastCandle()[s.termA]
    this.valueB = this.lastCandle()[s.termB]
    console.log('lastCandle', this.lastCandle())
    console.log('valueA', this.valueA)
    console.log('valueB', this.valueB)

    console.log(
      'result', 
      Operators[s.operator](this.valueA, this.valueB)
    )
  }
}

s.readAll()
.then(
  candles => {
    var c = new Analyzer(candles, strat)
    c.run()
  }
)
// console.log('termA isCandleValue', Calc.isCandleValue(strat.termA))
// console.log('termB isCandleValue', Calc.isCandleValue(strat.termB))