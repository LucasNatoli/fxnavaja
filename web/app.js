
'use strict';
var templates = {
  rankingCard: document.getElementById('ranking_card_template'),
  exchangesListItem: document.getElementById('exchanges_listitem'),
  scanProfileListItem: document.getElementById('scan_profiles_listitem'),
}

var storage = {
  exchanges: [
    {
      value: 'binance',
      text: 'Binance',
      intevals: [
        {value: '1m', text: '1 minuto'},
        {value: '5m', text: '5 Minutos'}, 
        {value: '30m', text: '30 Minutos'},
        {value: '1h', text: '1 Hora'},
        {value: '4h', text: '4 Horas'},
        {value: '12h', text: '12 Horas'},
        {value: '1d', text: '1 Dia'},
        {value: '1w', text: '1 Semana'},
        {value: '1M', text: '1 Mes'},
      ]
    }
    ,
    {
      value: 'bittrex',
      text: 'Bittrex',
      intevals: [
        {value: 'oneMin', text: '1 minuto'},
        {value: 'fiveMin', text: '5 Minutos'}, 
        {value: 'thirtyMin', text: '30 Minutos'},
        {value: 'hour', text: '1 Hora'},
        {value: 'day', text: '1 Dia'}
      ]
    }    
  ]
};

storage.fetch = function(endpoint, slotName, onSuccess){
  if (!storage[slotName]) {
    sendAjaxRequest(endpoint, 'GET', null, (status, results) => {
      if (status===200) {
        storage[slotName]=results
        if (onSuccess) onSuccess(storage[slotName])
      }
    })
  }
}

var app = {
  isLoading: true,
  baseUrl: 'http://localhost:3000',
  userData: {},
  spinner: document.getElementById('spinner'),
  registerDialog: document.getElementById('register_dialog'),
  loginDialog: document.getElementById('login_dialog'),
  strategyBookmarkDialog: document.getElementById('strategy_bookmark_dialog'),
  rankingPanel: document.getElementById('ranking_panel'),
  exchangesPanel: document.getElementById('exchanges_panel'),
  scanProfilesPanel: document.getElementById('scan_profiles_panel'),
  notification: document.querySelector('.mdl-js-snackbar')
};  

/***************************************************************************
* UI events
****************************************************************************/
document.addEventListener("DOMContentLoaded", function(event) { 
  sendAjaxRequest('/accounts/check', 'GET', null, callBackCheckSession)
})

document.getElementById('add_strategy_bookmark_button').addEventListener('click', function(e){
  e.preventDefault()
  hideAll()
  showElement(app.strategyBookmarkDialog)
})

document.getElementById('btn_exchanges').addEventListener('click', function(e){
  e.preventDefault()
  hideAll()
  showElement(app.exchangesPanel)
})

document.getElementById('btn_home').addEventListener('click', function(e){
  e.preventDefault()
  hideAll()
  showElement(app.rankingPanel)
})

document.getElementById('btn_scan_profiles').addEventListener('click', function(e) {
  e.preventDefault()
  hideAll()
  showElement(app.scanProfilesPanel)
})

document.getElementById('btn_logout').addEventListener('click', function(){
  sendAjaxRequest('/accounts/logout', 'GET')
})

document.getElementById('new_account').addEventListener('click', function(){
  hideElement(app.loginDialog);
  showElement(app.registerDialog);
})

document.getElementById('register_button').addEventListener('click', function(){
  var parameters = JSON.stringify({
    "userid": document.getElementById('reg-userid').value,
    "name": document.getElementById('reg-name').value,
    "phone": document.getElementById('reg-phone').value,
    "password": document.getElementById('reg-password').value
  })
  hideElement(app.registerDialog)
  sendAjaxRequest("/accounts/register", "POST", parameters, callBackRegister)
})

document.getElementById('login_button').addEventListener('click', function() {
  var parameters = JSON.stringify({
      "userid": document.getElementById('userid').value,
      "password": document.getElementById('password').value
  })
  hideElement(app.loginDialog)
  sendAjaxRequest("/accounts/login", "POST", parameters, callBackLogin)
})

/***************************************************************************
* UI methods
****************************************************************************/
function showElement(element){
  element.classList.remove("hide");
}

function hideElement(element){
  element.classList.add("hide");
}

function hideAll(){
  hideElement(app.registerDialog)
  hideElement(app.loginDialog)
  hideElement(app.scanProfilesPanel)
  hideElement(app.rankingPanel)
  hideElement(app.exchangesPanel)
}

function clearList(element) {
  while(element.childElementCount>0){
    list.removeChild(element.firstChild)
  }
}

function removeOptions(selectBox) {
  for(var i=0; i < selectBox.options.length; i++) {
    selectBox.remove(i)
  }
}

function renderOptions(selectBox, value, text) {
  var option = document.createElement('option')
  option.value = value
  option.innerText = text
  selectBox.appendChild(option)
}

function drawRanking(ranking){
  
  clearList(app.rankingPanel)
  storage.ranking.forEach(element => {
    var e = templates.rankingCard.cloneNode(true)
    e.getElementsByClassName('name')[0].innerText = element.name
    e.getElementsByClassName('price_btc')[0].innerText = element.price_btc
    e.getElementsByClassName('price_usd')[0].innerText = element.price_usd
    e.getElementsByClassName('vol_24h_usd')[0].innerText = element.vol_24h_usd
    e.getElementsByClassName('percent_change_24h')[0].innerText = element.percent_change_24h + '%'
    app.rankingPanel.appendChild(e)
    showElement(e)
  })
}

function drawListExchanges(exchanges){
  
  let list = app.exchangesPanel.getElementsByClassName('mdl-list')[0]
  clearList(list)

  exchanges.forEach(element => {
    var e = templates.exchangesListItem.cloneNode(true)
     e.getElementsByClassName('name')[0].innerText = element.name
    list.appendChild(e)
    showElement(e)
  })
}

function drawListScanProfiles(){
  
  let list = app.scanProfilesPanel.getElementsByClassName('mdl-list')[0]
  clearList(list)
  storage.scanProfiles.forEach(p => {
    var e = templates.scanProfileListItem.cloneNode(true)
    e.getElementsByClassName('scan_profile_exchange')[0].innerText = p.exchange
    e.getElementsByClassName('scan_profile_coin')[0].innerText = p.coin
    e.getElementsByClassName('scan_profile_asset')[0].innerText = p.asset
    e.getElementsByClassName('scan_profile_interval')[0].innerText = p.interval
    list.appendChild(e)
    showElement(e)
  })
}

function showNotification(message, timeout, actionText, actionHandler){
  var data = {
    message: message,
    timeout: timeout,
    actionText: actionText
  }
  if (actionHandler) {
    data.actionHandler = actionHandler(event)
  }
  app.notification.MaterialSnackbar.showSnackbar(data)
}

/***************************************************************************
* Callbacks
****************************************************************************/
function initApp(response) {
  app.userData = response;
  storage.fetch('/ranking', 'ranking', ()=>{
    drawRanking()
    showElement(app.rankingPanel)
  })
  storage.fetch('/exchanges', 'exchanges', drawListExchanges)
  storage.fetch('/scan-profiles', 'scanProfiles', drawListScanProfiles)  
}
function callBackCheckSession(status, response) {

  if (status === 200) {initApp(response)}
  if (status === 401) {showElement(app.loginDialog)}
}

function callBackLogin(status, response) {
  if (status === 200) {initApp(response) }
  if (status === 401) {
    showNotification('Combinacion incorrecta!', 4000, 'ok')
    showElement(app.loginDialog)
  }  
}

function callBackRegister(status, response) {
  if (status === 200) {
    hideElement(app.registerDialog);
    showElement(app.loginDialog);
  }
  if (status === 401) {
    showNotification('Esa cuenta ya existe!', 4000, 'Ok')
    showElement(app.registerDialog);
  }
  if (status === 500) {
      //showElement(app.registerError);
  } 
}   




/***************************************************************************
* Server comm
****************************************************************************/
function sendAjaxRequest(endpoint, method, parameters, onComplete) {
  var request = new XMLHttpRequest();
  showElement(app.spinner);
  request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        hideElement(app.spinner);
        var res = []; 
        if (request.response) res = JSON.parse(request.response);
        if (onComplete) onComplete(request.status, res)
      }
  } 
  request.open(method, endpoint, true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(parameters);
}
