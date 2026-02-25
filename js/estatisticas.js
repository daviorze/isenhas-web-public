var token = "";
var passwords;
var todasSenhas = [];
var numeroSenhas = 0;
var editSelected = 0;
var enviado = 0;
selectedRows = [];
var company_user = {};
const title = document.getElementById("title");
const desc1 = document.getElementById("desc1");
const desc2 = document.getElementById("desc2");
const button = document.getElementById("button");
const loading = document.getElementById("loading");
const form = document.getElementById("form");
const loadinglabel = document.getElementById("loadinglabel");
const spinner = document.getElementById("spinner");
const table = document.getElementById("tabela");
const search = document.getElementById("search");

window.onload = function () {
    translate();
    loading.style.display = "block";
    limiter.style.display = "none";
    var permission = getCookie("permission");
    if(permission == "ADMIN"){
      usersmenu.style.display = "block";
    }else {
      usersmenu.style.display = "none";
    }
    var token = getCookie("recovery");
    if (token != null && token != "") {
      spinner.style.display = "none";
      loadinglabel.innerHTML = gettranslate("feature_not_available_extreme");
    } else {
      getStatistics()
    }
};
function getStatistics() {
  todasSenhas = [];
  var token = getCookie("tokenis");
  if (token == null || token == "") {
    window.location = 'login.html';
  }
  loadinglabel.innerHTML = gettranslate("search_statistics")+"...";
  var xhr = new XMLHttpRequest();
  var url = host+"/iSenhasBuscarEstatisticasV4";
  if(development) url = host+"/iSenhasBuscarEstatisticasV4DEV";
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('authorization', token);

  xhr.onreadystatechange =  function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var objResponse = JSON.parse(xhr.responseText);
      var records = objResponse.company;
      if (records.length == 0) {
        limiter.style.display = "block";
        loading.style.display = "none";
      } else {
          reloadScreen(records)
      }
    } else if (xhr.readyState === 4 && xhr.status === 401) {
      console.log(xhr.status);
      spinner.style.display = "none";
      window.location = 'login.html';
    }else if (xhr.readyState === 4) {
      console.log(xhr.status);
      spinner.style.display = "none";
      loadinglabel.innerHTML = gettranslate("search_statistics_error")+": " + xhr.status;
    }
  };

  xhr.send();
}
function reloadScreen(records){
  if(records.company_name)
    title.innerHTML = records.company_name
  limiter.style.display = "block";
  loading.style.display = "none";
  healthvalue.innerHTML= Math.round(records.statistics.health)+"%"
  totalvalue.innerHTML = records.all_passwords
  repeatedvalue.innerHTML = records.statistics.repeated_passwords
  subscriptionsvalue.innerHTML = records.subscriptions_active+'/'+records.subscriptions
  id="categoria1label"
  var category = records.statistics.category;
  for(var i=0;i<category.length;i++){
    var index = i+1;
    var name = "categoria"+index+"label"
    var nameprogress = "categoria"+index
    document.getElementById(name).innerHTML = gettranslate(category[i].name)
    document.getElementById(nameprogress).style.width = Math.round(category[i].value)+"%"
    document.getElementById(nameprogress).innerHTML = Math.round(category[i].value)+"%"

  }
  var users = records.users;
  $('#table-body').empty();
  for(var x=0;x<users.length;x++){
    var element = users[x];
    $('#table-body').append(`
                <tr class="rows" id='${x+1}'>            
                  <td class= "info" id="email" >${element.email}</td>
                  <td class= "info" id="strong" >${element.strong_passwords}</td>
                  <td class= "info" id="regular" >${element.regular_passwords}</td>
                  <td class= "info" id="weak" >${element.weak_passwords}</td>
                  <td class= "info" id="repeated" >${element.repeated_passwords}</td>

                  
                </tr>
            `)

  }
  var strong = gettranslate("strong_password")
  var chart = {
    bindto: "#c3chart_donut",
    size: {
      height: 385
    },
    data: {
      columns: [
        [gettranslate("strong_password"), records.statistics.strong_passwords],
        [gettranslate("regular_password"), records.statistics.regular_passwords],
        [gettranslate("weak_password"), records.statistics.weak_passwords]
      ],
      type: 'donut',
      onclick: function (d, i) { console.log("onclick", d, i); },
      onmouseover: function (d, i) { console.log("onmouseover", d, i); },
      onmouseout: function (d, i) { console.log("onmouseout", d, i); },
      colors: {
        
      }
    },
    donut: {
      title: ""
    }
  }
  var language =  navigator.language || navigator.userLanguage; 
  if(!language.includes("pt")){
    if(!language.includes("es")){
      chart.data.colors["Strong"] = '#29BF12'
      chart.data.colors["Regular"] = '#F5BB00'
      chart.data.colors["Weak"] = '#ea1b4b'
    } else {
      chart.data.colors["Fuerte"] = '#29BF12'
      chart.data.colors["Regular"] = '#F5BB00'
      chart.data.colors["Débil"] = '#ea1b4b'
    }
  } else {
    chart.data.colors["Fortes"] = '#29BF12'
    chart.data.colors["Regulares"] = '#F5BB00'
    chart.data.colors["Fracas"] = '#ea1b4b'
  }
  c3.generate(chart);
  
}
function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function senhas(){
  window.location = "senhas.html";
}
function notas(){
  window.location = "notas.html";
}
async function sair() {
  document.cookie = "tokenis=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "permission=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "recovery=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  await deleteKey();
  window.location = 'login.html';
}
function pix(){
  window.location = "pix.html";
}
function users() {
  window.location = 'usuarios.html';
}

function estatisticas(){
  window.location = 'estatisticas.html'
}
function reloadTable(){
    $('#table-body').empty();
    title.innerHTML = gettranslate("users")+" ("+todasSenhas.length+"/"+company_user.subscriptions+")"
    for(var i=0;i<todasSenhas.length;i++){
        var user = todasSenhas[i];
        $('#table-body').append(`
                <tr class="rows" id='${i+1}'>            
                  <td class= "info" id="email" onclick="select(${i+1})">${user.email}</td>
                  <td class= "info" id="permission" onclick="select(${i+1})">${user.permission}</td>
                  <td class= "info" style="text-align:left;">
                    <i class="far fa-edit" onClick= "edit(${i+1})"></i>
                  </td>
                  <td class= "info" id="recordName" onclick="select(${i+1})" style="display: none;">${user.recordName}</td>
                  <td class= "info" id="recordChangeTag" onclick="select(${i+1})" style="display: none;">${user.recordChangeTag}</td>
                </tr>
            `)
    }
    loading.style.display = "none";
    limiter.style.display = "block";

}
function searchPass(){
    var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();
  table = document.getElementById("table-body");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}
function select(id){
  var tr = table.getElementsByTagName("tr");
  var td = tr[id];
  if(td){
    if(td.className == "selected"){
      td.className = "rows"
      var filterSelected = [];
      for (var ele in selectedRows){
        var originalIndex = selectedRows[ele].originalIndex;
        console.log(originalIndex)
        if(originalIndex != id){
          filterSelected.push(selectedRows[ele]);
        }
      }
      selectedRows = filterSelected;
    } else {
      td.className = "selected"
      var recordName = tr[id].getElementsByTagName("td")[3].innerHTML;
      var recordChangeTag = tr[id].getElementsByTagName("td")[4].innerHTML;
      selectedRows.push({"originalIndex":id,"element":{"recordName":recordName,"recordChangeTag":recordChangeTag}})
    }
    console.log(selectedRows)
  }
}
var Password = {
 
  _pattern : /[a-zA-Z0-9_\-\+\.]/,
  
  
  _getRandomByte : function()
  {
    // http://caniuse.com/#feat=getrandomvalues
    if(window.crypto && window.crypto.getRandomValues) 
    {
      var result = new Uint8Array(1);
      window.crypto.getRandomValues(result);
      return result[0];
    }
    else if(window.msCrypto && window.msCrypto.getRandomValues) 
    {
      var result = new Uint8Array(1);
      window.msCrypto.getRandomValues(result);
      return result[0];
    }
    else
    {
      return Math.floor(Math.random() * 256);
    }
  },
  
  generate : function(length)
  {
    return Array.apply(null, {'length': length})
      .map(function()
      {
        var result;
        while(true) 
        {
          result = String.fromCharCode(this._getRandomByte());
          if(this._pattern.test(result))
          {
            return result;
          }
        }        
      }, this)
      .join('');  
  }    
    
};
function updateInput(ish){
  var sizeOfCharacterSet=0;
  if (ish.match(/[a-z]+/)){
    sizeOfCharacterSet+=26;
  }
  if (ish.match(/[A-Z]+/)){
    sizeOfCharacterSet+=26;
  }
  if (ish.match(/[0-9]+/)){
    sizeOfCharacterSet+=26;
  }
  if (ish.match(/[_-{}()|'".:;,<>?!@#%]+/)){
    sizeOfCharacterSet+=20;
  }
  if (ish.match(/[$=+/€®ŧ←↓→øþæßðđŋħjĸł»©“”nµ]+/)){
    sizeOfCharacterSet+=10;
  }
  if (ish.match(/[ ]+/)){
    sizeOfCharacterSet+=1;
  }
  var entropy = Math.log2(sizeOfCharacterSet);
  var entropy = entropy * ish.length;
  if (entropy < 28) {
    strong.innerHTML = gettranslate("very_weak")
    strong.style.color = "#F4364C"
    strongedit.innerHTML = gettranslate("very_weak")
    strongedit.style.color = "#F4364C"
  } else if (entropy < 36) {
    strong.innerHTML = gettranslate("weak")
    strong.style.color = "#F4364C"
    strongedit.innerHTML = gettranslate("weak")
    strongedit.style.color = "#F4364C"
  } else if (entropy < 60) {
    strong.innerHTML = gettranslate("regular")
    strong.style.color = "#F5BB00"
    strongedit.innerHTML = gettranslate("regular")
    strongedit.style.color = "#F5BB00"
  } else if (entropy < 128) {
    strong.innerHTML = gettranslate("strong")
    strong.style.color = "#29bf12"
    strongedit.innerHTML = gettranslate("strong")
    strongedit.style.color = "#29bf12"
  } else {
    strong.innerHTML = gettranslate("very_strong")
    strong.style.color = "#29bf12"
    strongedit.innerHTML = gettranslate("very_strong")
    strongedit.style.color = "#29bf12"
  }
}
function alertas(){
  window.location = "alertas.html";
}
function doc(){
  window.location = "documents.html";
}
function translate(){
    document.getElementById("loadinglabel").innerHTML = gettranslate("search_statistics");
    document.getElementById("docsmenu").innerHTML = gettranslate("docsmenu");
    document.getElementById("search").placeholder = gettranslate("search_user");
    document.getElementById("page").placeholder = gettranslate("login_title");
    document.getElementById("general").innerHTML = gettranslate("general");
    document.getElementById("passwordsmenu").innerHTML = gettranslate("passwordsmenu");
    document.getElementById("notesmenu").innerHTML = gettranslate("notesmenu");
    document.getElementById("logoutmenu").innerHTML = gettranslate("logoutmenu");
    document.getElementById("title").innerHTML = gettranslate("statistics");
    document.getElementById("health_title").innerHTML = gettranslate("health");
    document.getElementById("total_title").innerHTML = gettranslate("total_passwords");
    document.getElementById("repeated_title").innerHTML = gettranslate("repeated_passwords");
    document.getElementById("subscription_title").innerHTML = gettranslate("users_subscriptions");
    document.getElementById("categoria_title").innerHTML = gettranslate("main_categories");
    document.getElementById("users_title").innerHTML = gettranslate("main_users");
    document.getElementById("strong_title").innerHTML = gettranslate("strong");
    document.getElementById("regular_title").innerHTML = gettranslate("regular");
    document.getElementById("weak_title").innerHTML = gettranslate("weak");
    document.getElementById("repeated_title_table").innerHTML = gettranslate("repeated");
    document.getElementById("alertsmenu").innerHTML = gettranslate("alertsmenu");
    document.getElementById("usersmenu2").innerHTML = gettranslate("usersmenu2");
    document.getElementById("estatisticasmenu2").innerHTML = gettranslate("estatisticasmenu2");
    document.getElementById("pixmenu").innerHTML = gettranslate("pixmenu");
}