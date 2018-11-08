'use strict';

var templates = {
  rankingCard: document.getElementById('ranking_card_template'),
  exchangesListItem: document.getElementById('exchanges_listitem'),
  scanProfileListItem: document.getElementById('scan_profiles_listitem'),
  triggerListItem: document.getElementById('trigger_listitem')
}

var storage = {
  exchanges: [
    {
      value: 'binance',
      text: 'Binance',
      intervals: [
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
    },
    {
      value: 'bittrex',
      text: 'Bittrex',
      intervals: [
        {value: 'oneMin', text: '1 minuto'},
        {value: 'fiveMin', text: '5 Minutos'}, 
        {value: 'thirtyMin', text: '30 Minutos'},
        {value: 'hour', text: '1 Hora'},
        {value: 'day', text: '1 Dia'}
      ]
    }    
  ],
  triggers: [
    {id: 1, name: 'Comprar por debajo de Bollinger Low', termA: 'C', termB: 'BB_C_20_2_lower', operator: 'lessOrEqual'},
    {id: 2, name: 'Vender por arriba de Bollinger Upper', termA: 'C', termB: 'BB_C_20_2_upper', operator: 'greaterOrEqual'}
  ]

};

storage.fetch = function(endpoint, slotName, onSuccess, onError){

  //ESTO ES TOTALMENTE PRECARIO Y ES A FIN DE MAQUETADO
  if (!storage[slotName]) {
    sendAjaxRequest(endpoint, 'GET', null, (status, results) => {
      if (status===200) {
        storage[slotName]=results
        if (onSuccess) onSuccess()
      } else {
        if (onError) onError(status)
        //onError ? onError(status) : null
      }
    })
  } else {
    if (onSuccess) onSuccess()
  }
}

var app = {
  isLoading: true,
  baseUrl: 'http://localhost:3000',
  userData: {},
  spinner: document.getElementById('spinner'),
  notification: document.querySelector('.mdl-js-snackbar'),

  registerDialog: document.getElementById('register_dialog'),
  loginDialog: document.getElementById('login_dialog'),
  strategyBookmarkDialog: document.getElementById('strategy_bookmark_dialog'),

  rankingPanel: document.getElementById('ranking_panel'),
  exchangesPanel: document.getElementById('exchanges_panel'),
  scanProfilesPanel: document.getElementById('scan_profiles_panel'),
  triggersPanel: document.getElementById('triggers_panel'),

  navHome: document.getElementById('btn_home_nav'),
  navBookmarks: document.getElementById('btn_bookmarks_nav'),
  navExchanges: document.getElementById('btn_exchanges'),
  navTriggers: document.getElementById('btn_triggers_nav'),

  newBookmarkButton : document.getElementById('add_strategy_bookmark_button'),
  newAccountButton: document.getElementById('new_account'),
  registerButton: document.getElementById('register_button'),
  loginButton: document.getElementById('login_button'),
  logoutButton : document.getElementById('btn_logout'),
  strategySaveButton: document.getElementById('strategy_save_button'),

  exchangesSelect: document.getElementById('strategy-exchange'),
  intervalsSelect: document.getElementById('strategy-interval'),
  triggersSelect: document.getElementById('strategy-trigger')
};  

/***************************************************************************
* UI events
****************************************************************************/
document.addEventListener("DOMContentLoaded", e => { 
  sendAjaxRequest('/accounts/check', 'GET', null, callBackCheckSession)
})
app.newBookmarkButton.addEventListener('click', e => {
  e.preventDefault()
  hideAll()
  showElement(app.strategyBookmarkDialog)
})
app.navExchanges.addEventListener('click', e => {
  e.preventDefault()
  hideAll()
  showElement(app.exchangesPanel)
})
app.navHome.addEventListener('click', e => {
  e.preventDefault()
  hideAll()
  showElement(app.rankingPanel)
})
app.navBookmarks.addEventListener('click', e => {
  e.preventDefault()
  hideAll()
  showElement(app.scanProfilesPanel)
})
app.navTriggers.addEventListener('click', e => {
  e.preventDefault()
  hideAll()
  showElement(app.triggersPanel)
})
app.logoutButton.addEventListener('click', () => {
  sendAjaxRequest('/accounts/logout', 'GET')
})
app.newAccountButton.addEventListener('click', () => {
  hideElement(app.loginDialog);
  showElement(app.registerDialog);
})
app.registerButton.addEventListener('click', () => {
  var parameters = JSON.stringify({
    "userid": document.getElementById('reg-userid').value,
    "name": document.getElementById('reg-name').value,
    "phone": document.getElementById('reg-phone').value,
    "password": document.getElementById('reg-password').value
  })
  hideElement(app.registerDialog)
  sendAjaxRequest("/accounts/register", "POST", parameters, callBackRegister)
})
app.loginButton.addEventListener('click', () => {
  var parameters = JSON.stringify({
      "userid": document.getElementById('userid').value,
      "password": document.getElementById('password').value
  })
  hideElement(app.loginDialog)
  sendAjaxRequest("/accounts/login", "POST", parameters, callBackLogin)
})
app.exchangesSelect.addEventListener('change', ()=>{
  var exchs = storage.exchanges.filter(
    (exch) => {return exch.value === app.exchangesSelect.value}
  )
  renderIntervalOptions(exchs[0].intervals)
})
app.strategySaveButton.addEventListener('click', e => {
  var parameters = JSON.stringify({
    "exchange": app.exchangesSelect.value,
    "coin": document.getElementById('strategy-coin').value,
    "asset": document.getElementById('strategy-asset').value,
    "interval": app.intervalsSelect.value,
    "trigger": app.triggersSelect.value
  })
  console.log('parametros', parameters)
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
  hideElement(app.strategyBookmarkDialog)
  hideElement(app.triggersPanel)
}
function removeListitems(list) {
  while(list.childElementCount>0){
    list.removeChild(list.firstChild)
  }
}
function removeOptions(select) {
  for(var i=0; i < select.options.length; i++) {
    select.remove(i)
  }
}
function renderRanking(ranking){
  
  removeListitems(app.rankingPanel)
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
function renderExchangesPanel(){
  
  let list = app.exchangesPanel.getElementsByClassName('mdl-list')[0]
  removeListitems(list)
  storage.exchanges.forEach(
    exchange => {
      var e = templates.exchangesListItem.cloneNode(true)
      e.getElementsByClassName('name')[0].innerText = exchange.text
      list.appendChild(e)
      showElement(e)
    }
  )
}
function renderTriggersPanel(){
  
  let list = app.triggersPanel.getElementsByClassName('mdl-list')[0]
  removeListitems(list)
  storage.triggers.forEach(
    trigger => {
      var e = templates.triggerListItem.cloneNode(true)
      e.getElementsByClassName('trigger_name')[0].innerText = trigger.name
      e.getElementsByClassName('trigger_termA')[0].innerText = trigger.termA
      e.getElementsByClassName('trigger_operator')[0].innerText = trigger.operator
      e.getElementsByClassName('trigger_termB')[0].innerText = trigger.termB
      list.appendChild(e)
      showElement(e)
    }
  )
}
function renderScanProfilesList(){
  
  let list = app.scanProfilesPanel.getElementsByClassName('mdl-list')[0]
  removeListitems(list)
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
function renderIntervalOptions(intervals) {
  var html = "<option></option>"
  removeOptions(app.intervalsSelect)
  intervals.forEach(
    (interval) => { html += "<option value='" + interval.value + "'>" + interval.text + "</option>" }
  )
  app.intervalsSelect.innerHTML = html
}
function renderTriggersOptions() {
  var html = "<option></option>"
  removeOptions(app.triggersSelect)
  storage.triggers.forEach(
    trigger => {html += "<option value='" + trigger.id + "'>" + trigger.name + "</option>"}
  )
  app.triggersSelect.innerHTML = html
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
  app.userData = response

  //TODO: Faltan los onError de todos estos fetch
  storage.fetch('/ranking', 'ranking', ()=>{
    renderRanking()
    showElement(app.rankingPanel)  
  })
  storage.fetch('/exchanges', 'exchanges', renderExchangesPanel)
  storage.fetch('/scan-profiles', 'scanProfiles', renderScanProfilesList)  
  storage.fetch('/triggers', 'triggers', () => {
    renderTriggersOptions()
    renderTriggersPanel()
  })  
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
