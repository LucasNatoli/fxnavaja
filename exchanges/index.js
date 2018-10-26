'use strict'


function Exchanges() {}

Exchanges.prototype.getWarper = function(exchange){

  var ret 
  if (exchange === 'bittrex') {
    ret = require('./bittrex')
  } 
  if (exchange === 'binance') {
    ret = require('./binance')
  }  
  return ret
};


module.exports = new Exchanges()