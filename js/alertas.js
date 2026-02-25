var token = "";
var passwords;
var todasSenhas = [];
var cloudPasswords =[];
var numeroSenhas = 0;
var editSelected = 0;
var enviado = 0;
selectedRows = [];
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
var sliderEdit = document.getElementById("myRangeEdit");
var outputEdit = document.getElementById("lengthPassEdit");
var maiusculasEdit = document.getElementById("maiusculasEdit");
var minusculasEdit = document.getElementById("minusculasEdit");
var caracteresEdit = document.getElementById("caracteresEdit");
var numerosEdit = document.getElementById("numerosEdit");
var isExtreme = false
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
      isExtreme = true
    }
    getPasswords()
    //form.style.display = "none";
};
async function decryptExtreme(value){
  let recovery = await decryptData(getCookie("recovery"))
  var decrypted = await extremeDecrypt(value, recovery);
  return decrypted
}
async function encryptExtreme(value){
  let recovery = await decryptData(getCookie("recovery"))
  var decrypted = await extremeEncrypt(value, recovery);
  return decrypted
}
function estatisticas(){
  window.location = 'estatisticas.html'
}
sliderEdit.oninput = function() {
  outputEdit.innerHTML = this.value;
}
sliderEdit.onchange = function() {
  gerarsenhaedit()
}
maiusculasEdit.onchange = function() {
  gerarsenhaedit()
}
minusculasEdit.onchange = function() {
  gerarsenhaedit()
}
numerosEdit.onchange = function() {
  gerarsenhaedit()
}
caracteresEdit.onchange = function() {
  gerarsenhaedit()
}
function getPasswords() {
  todasSenhas = [];
  var token = getCookie("tokenis");
  if (token == null || token == "") {
    window.location = 'login.html';
  }
  loadinglabel.innerHTML = gettranslate("search_passwords")+"...";
  var xhr = new XMLHttpRequest();
  var url = host+"/iSenhasBuscarSenhasV4";
  if(development) url = host+"/iSenhasBuscarSenhasV4DEV";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('authorization', token);

  xhr.onreadystatechange = async function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var objResponse = JSON.parse(xhr.responseText);
      var records = objResponse.passwords;
      if (records.length == 0) {
        limiter.style.display = "block";
        loading.style.display = "none";
      } else {
        var recovery = ""
        if(isExtreme)
          recovery = await decryptData(getCookie("recovery"));
        await Promise.all(records.map(async (rec) => {
          var sharedItem = false
          if(rec.fields.admin){
              sharedItem = true
          }
          rec.fields.password.value = window.atob(rec.fields.password.value);
          if (isExtreme && !sharedItem) {
            rec.fields.password.value = await extremeDecrypt(rec.fields.password.value, recovery);
          }
          if (isExtreme && !sharedItem) {
            rec.fields.name.value = await extremeDecrypt(rec.fields.name.value, recovery);
          }
          if (rec.fields.observation) {
            if (isExtreme && !sharedItem) {
              rec.fields.observation.value = await extremeDecrypt(rec.fields.observation.value, recovery);
            }
          }
          if (rec.fields.description) {
            if (isExtreme && !sharedItem) {
              rec.fields.description.value = await extremeDecrypt(rec.fields.description.value, recovery);
            }
          }
          if (rec.fields.old) {
            rec.fields.old.value = window.atob(rec.fields.old.value);
            if (isExtreme && !sharedItem) {
              rec.fields.old.value = await extremeDecrypt(rec.fields.old.value, recovery);
            }
          }
          if (rec.fields.secret) {
            if (isExtreme && !sharedItem) {
              rec.fields.secret.value = await extremeDecrypt(rec.fields.secret.value, recovery);
            }
          }
          if (rec.fields.period) {
            if (isExtreme && !sharedItem) {
              rec.fields.period.value = await extremeDecrypt(rec.fields.period.value, recovery);
            }
          }
          if (rec.fields.algorithm) {
            if (isExtreme && !sharedItem) {
              rec.fields.algorithm.value = await extremeDecrypt(rec.fields.algorithm.value, recovery);
            }
          }
          if (rec.fields.digits) {
            if (isExtreme && !sharedItem) {
              rec.fields.digits.value = await extremeDecrypt(rec.fields.digits.value, recovery);
            }
          }
        }));
        todasSenhas = records;
        loadinglabel.innerHTML = gettranslate("search_passwords")+": " + todasSenhas.length;
        getVaults()
      }
    } else if (xhr.readyState === 4 && xhr.status === 401) {
      spinner.style.display = "none";
      window.location = 'login.html';
    }else if (xhr.readyState === 4) {
      spinner.style.display = "none";
      var language = navigator.language || navigator.userLanguage;
      loadinglabel.innerHTML = gettranslate("search_passwords_error")+": " + xhr.status;
    }
  };

  xhr.send();
}
function getVaults() {
  vaults = [];
  var token = getCookie("tokenis");
  if (token == null || token == "") {
    window.location = 'login.html';
  }
  loadinglabel.innerHTML = gettranslate("search_vaults") + "...";
  var xhr = new XMLHttpRequest();
  var url = host + "/iSenhasBuscarCofresV4";
  if (development) url = host + "/iSenhasBuscarCofresV4DEV";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('Authorization', token);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var objResponse = JSON.parse(xhr.responseText);
      var records = objResponse.vaults;
      if (records.length == 0) {
        limiter.style.display = "block";
        loading.style.display = "none";
        reloadTable();
      } else {
        vaults = records;
        let vault = {"recordName":"0","name":gettranslate("personal")}
        vaults.unshift(vault)
        reloadTable();
      }
    } else if (xhr.readyState === 4 && xhr.status === 401) {
      spinner.style.display = "none";
      window.location = 'login.html';
    } else if (xhr.readyState === 4) {
      spinner.style.display = "none";
      loadinglabel.innerHTML = gettranslate("search_passwords_error") + ": " + xhr.status;
    }
  };

  xhr.send();
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
function users() {
  window.location = 'usuarios.html';
}
function passwordRepeated(array,pass){
  var repeats = 0;
  for(var i=0;i<array.length;i++){
    var password = array[i]
    var value =  password.fields.password.value
    if(value == pass)repeats++
  }
  if(repeats>1)return true;
  else return false;
}
function refreshOptionsVault(){
  var e = document.getElementById("vaulteditoptions");
  removeAll(e)
  vaults.forEach(vault => {
    var vaultid = vault.recordName;
    var name = vault.name;
    var option = document.createElement("option");
      option.text = name
      option.value = vaultid
      option.tag
      e.add(option);
  });
  $("#vaulteditoptions").selectpicker("refresh");
}
function removeAll(selectBox) {
  while (selectBox.options.length > 0) {
      selectBox.remove(0);
  }
}      
function reloadTable(){
    $('#table-body').empty();
    selectedRows = [];
    cloudPasswords = todasSenhas;
    var acumulador = 0;
    for(var i=0;i<todasSenhas.length;i++){
        var password = todasSenhas[i];
        var named = password.fields.name.value;
        var observation = "-";
        var type = "-";
        var category = getListIconFromText(password.fields.name.value).category;
        var imageName = getListIconFromText(password.fields.name.value).image;
        var vaultid = "0"
        if(password.fields.vaultid != null){
          vaultid = password.fields.vaultid.value
        }
        var vaultName = gettranslate("personal")
        for (var x = 0; x < vaults.length; x++){
          let currentid = vaults[x].recordName
          if(currentid == vaultid){
            vaultName = vaults[x].name
          }
        }
        var display = "none"
        if(vaults.length>0){
          display = "block"
        }
        if(category != "bank" && category != "document" && category!="note"&& imageName != "tim" && imageName != "whatsapp" && imageName != "fgts" && imageName != "cofre" && imageName != "iphone" && imageName != "giassi" && imageName != "samae"){
          var strength = updateInput(password.fields.password.value)
          var add = false;
          strengthLabel = "";
          var level = "";
          if(strength == 0){
            level = "red";
            strengthLabel = gettranslate("very_weak")
            if(passwordRepeated(cloudPasswords,password.fields.password.value)){
              strengthLabel = strengthLabel + " | "+gettranslate("repeated")
            }
            add = true;
          } else if(strength == 1){
            level = "red";
            strengthLabel = gettranslate("weak")
            if(passwordRepeated(cloudPasswords,password.fields.password.value)){
              strengthLabel = strengthLabel + " | "+gettranslate("repeated")
            }
            add = true;
          } else if(strength == 2){
            level = "yellow";
            strengthLabel = gettranslate("regular")
            if(passwordRepeated(cloudPasswords,password.fields.password.value)){
              strengthLabel = strengthLabel + " | "+gettranslate("repeated")
            }
            add = true;
          } else if(passwordRepeated(cloudPasswords,password.fields.password.value)){
            level = "yellow";
            strengthLabel = gettranslate("repeated")
            add = true;
          } 

          if(add){
            if(password.fields.observation !=null)observation = password.fields.observation.value;
            if(password.fields.type !=null)type = password.fields.type.value;
            var pass = password.fields.password.value
            var image = getListIconFromText(named).image;
            if(type == "note") image = "note";
            acumulador++
            $('#table-body').append(`
                    <tr class="rows" id='${acumulador}'>            
                      <td class= "info" id="name${i + 1}">
                    <div style="display: flex;">   
                      <img style="height:24px;margin-right:10px;" alt="Qries" src="../images/iconsmart/${image}.png" data-toggle="modal" data-target="#exampleModal" data-whatever="@fat" onClick= "copy(${i + 1})"/>
                    <div>
                    <div>${named}</div>
                      <div id="passvault${i + 1}" style="font-size:10px;margin-top:5px;display:${display}">${vaultName}</div>
                    </div>
                     </div>
                    </td>
                      <td class= "info" id="observation" >
                        <span class=${level}>${strengthLabel}</span>
                      </td>
                      <td class= "info" id="pass" ><input id="password" class="passwordRow" type="password" value="${pass}" readonly/></td>
                    <td class= "info" style="text-align:left;">
                        <i class="far fa-eye-slash" onClick= "showHide(${acumulador})"></i>
                    </td> 
                    <td class= "info" style="text-align:left;">
                    <i class="far fa-copy" onClick= "copy(${acumulador})"></i>
                    </td>
                    <td class= "info" style="text-align:left;">
                    <i class="far fa-edit" onClick= "edit(${i+1})"></i>
                    </td>
                    <td class= "info" id="recordName"  style="display: none;">${password.recordName}</td>
                    <td class= "info" id="recordChangeTag"  style="display: none;">${password.recordChangeTag}</td>
                    </tr>
                `)
          }
      } else if(category!="note") {
        if(passwordRepeated(cloudPasswords,password.fields.password.value)){
          level = "yellow";
          strengthLabel = gettranslate("repeated")
          if(password.fields.observation !=null)observation = password.fields.observation.value;
            if(password.fields.type !=null)type = password.fields.type.value;
            var pass = password.fields.password.value
            var image = getListIconFromText(named).image;
            if(type == "note") image = "note";
            acumulador++
            $('#table-body').append(`
                    <tr class="rows" id='${acumulador}'>            
                       <td class= "info" id="name${i + 1}">
                    <div style="display: flex;">   
                      <img style="height:24px;margin-right:10px;" alt="Qries" src="../images/iconsmart/${image}.png" data-toggle="modal" data-target="#exampleModal" data-whatever="@fat" onClick= "copy(${i + 1})"/>
                    <div>
                    <div>${named}</div>
                      <div id="passvault${i + 1}" style="font-size:10px;margin-top:5px;display:${display}">${vaultName}</div>
                    </div>
                     </div>
                    </td>
                      <td class= "info" id="observation" >
                        <span class=${level}>${strengthLabel}</span>
                      </td>
                      <td class= "info" id="pass" ><input id="password" class="passwordRow" type="password" value="${pass}" readonly/></td>
                    <td class= "info" style="text-align:left;">
                        <i class="far fa-eye-slash" onClick= "showHide(${acumulador})"></i>
                    </td> 
                    <td class= "info" style="text-align:left;">
                    <i class="far fa-copy" onClick= "copy(${acumulador})"></i>
                    </td>
                    <td class= "info" style="text-align:left;">
                    <i class="far fa-edit" onClick= "edit(${i+1})"></i>
                    </td>
                    <td class= "info" id="recordName"  style="display: none;">${password.recordName}</td>
                    <td class= "info" id="recordChangeTag"  style="display: none;">${password.recordChangeTag}</td>
                    </tr>
                `)
          }
      }
    }
    loading.style.display = "none";
    limiter.style.display = "block";
    refreshOptionsVault();

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
function showHide(id){
  var tr = table.getElementsByTagName("tr");
  var td = tr[id].getElementsByTagName("td")[2];
  var tdimage = tr[id].getElementsByTagName("td")[3];
  if(td){
    var img = tdimage.getElementsByTagName("i")[0];
    var p = td.getElementsByTagName("input")[0];
    if(p.type == "password"){
      p.type = "text";
      img.className = "fas fa-eye";
    } else {
      p.type = "password";
      img.className = "far fa-eye-slash";
    }
  }
}
function copy(id){
  var tr = table.getElementsByTagName("tr");
  var td = tr[id].getElementsByTagName("td")[2];
  var tdimage = tr[id].getElementsByTagName("td")[4];

  if(td){
    var p = td.getElementsByTagName("input")[0];
    var img = tdimage.getElementsByTagName("i")[0];
    img.className = "fas fa-copy";
    img.style.color = "#29bf12"
    var variable = p.value;
    navigator.clipboard.writeText(variable);
    setTimeout(() => { img.className = "far fa-copy"; 
    img.style.color = "#fff"
    }, 1000);
  }
}
function edit(id){
  document.getElementById("advancedDiceEdit").hidden = true;
  var modal = $("#editarModal")
  var observation = "";
  if(todasSenhas[id-1].fields.observation != undefined)observation = todasSenhas[id-1].fields.observation.value
  var description = "";
  if(todasSenhas[id-1].fields.description != undefined)description = todasSenhas[id-1].fields.description.value
  var vaultid = "0"
  var currentvaultid = ""
  if (todasSenhas[id - 1].fields.vaultid != undefined) currentvaultid = todasSenhas[id - 1].fields.vaultid.value
  for(var i=0;i<vaults.length;i++){
    let vault = vaults[i]
    let myid = vault.recordName
    if(currentvaultid == myid){
      vaultid = myid
    }
  }
  const select = document.getElementById('vaulteditoptions');
  select.value = vaultid;
  select.dispatchEvent(new Event('change'));
  modal.find('#nomeedit').val(todasSenhas[id-1].fields.name.value)
  modal.find('#senhaedit').val(todasSenhas[id-1].fields.password.value)
  modal.find('#usuarioedit').val(observation)
  modal.find('#descriptionedit').val(description)
  updateInput(todasSenhas[id-1].fields.password.value)
  let translator = gettranslate("favorite_password")
  if(todasSenhas[id-1].fields.favorite != undefined){
    var favswitch = document.getElementById("favswitch")
    favswitch.innerHTML = `
    <img style="padding-top: 7px;padding-bottom: 7px;padding-right: 7px;height: 38px !important; width: 31px !important;" alt="Qries" src="../images/iconsmart/star.png"/>
              <label for="recipient-name" class="col-form-label" style="color: #fff;"
                id="favoriteditlabel">${translator}</label>
                <label id="switchedit" class="switch" style="color: #fff;margin-left: auto;margin-right: 0px;margin-top: 8px;">
                  <input id="favoriteedit" type="checkbox" checked>
                  <span class="slider round"></span>
              </label>
    `
  } else {
    var favswitch = document.getElementById("favswitch")
    favswitch.innerHTML = `
    <img style="padding-top: 7px;padding-bottom: 7px;padding-right: 7px;height: 38px !important; width: 31px !important;" alt="Qries" src="../images/iconsmart/star.png"/>
              <label for="recipient-name" class="col-form-label" style="color: #fff;"
                id="favoriteditlabel">${translator}</label>
                <label id="switchedit" class="switch" style="color: #fff;margin-left: auto;margin-right: 0px;margin-top: 8px;">
                  <input id="favoriteedit" type="checkbox">
                  <span class="slider round"></span>
              </label>
    `
  }
  editSelected = id;
  $("#editarModal").modal();
  
}
function buttoneditar(){
  var modal = $("#editarModal")
  if(modal.find('#nomeedit').val().length == 0){
    document.getElementById("nomeeditlabel").style.color = "#F4364C"
    return;
  }else{
    document.getElementById("nomeeditlabel").style.color = "white"
  }
  if(modal.find('#senhaedit').val().length == 0){
    document.getElementById("senhaeditlabel").style.color = "#F4364C"
    return;
  } else {
    document.getElementById("senhaeditlabel").style.color = "white"
  }
  modal.modal("hide")
  loading.style.display = "block";
  loadinglabel.style.display = "block";
  limiter.style.display = "none";
  editSenha();
}
async function editSenha() {
  var token = getCookie("tokenis");
  if (token == null || token == "") {
    window.location = 'login.html';
  }
  loadinglabel.innerHTML = gettranslate("update_password")+"...";
  var xhr = new XMLHttpRequest();
  var url = host+"/iSenhasAtualizarV4";
  if(development) url = host+"/iSenhasAtualizarV4DEV";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('authorization', token);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      limiter.style.display = "none";
      loading.style.display = "block";
      getPasswords()
    } else if (xhr.readyState === 4) {
      spinner.style.display = "none";
      loadinglabel.innerHTML = gettranslate("update_password_error")+": " + xhr.status;
    }
  };
  var modal = $("#editarModal")
  let currentPassword = todasSenhas[editSelected-1]
  var myName = modal.find('#nomeedit').val()
  if(isExtreme){
    myName = await encryptExtreme(myName)
  }
  var myPassword = modal.find('#senhaedit').val()
  if(isExtreme){
    myPassword = await encryptExtreme(myPassword)
  }
  var oldPassword = todasSenhas[editSelected-1].fields.password.value;
  var observation = modal.find('#usuarioedit').val();
  var description = modal.find('#descriptionedit').val();
  var favorite = document.getElementById("favoriteedit")
  if(observation.length!=0){
    if(isExtreme){
      observation = await encryptExtreme(observation)
    }
  }
  if(description.length!=0){
    if(isExtreme){
      description = await encryptExtreme(description)
    }
  }
  if(modal.find('#senhaedit').val() == oldPassword) oldPassword = "";
  var operations = [];
  var operation = {"record":{"recordName":todasSenhas[editSelected-1].recordName,"recordChangeTag":todasSenhas[editSelected-1].recordChangeTag,"recordType":"passwords",
  "fields":{
   "name":{"value":myName},
  "password":{"value":myPassword},
  "observation":{"value":observation},
  "description":{"value":description}
  }},"operationType":"update"};
  if(favorite.checked){
    operation.record.fields.favorite = {"value":"ok"}
  }
  if(oldPassword.length > 0){
    if(isExtreme){
      oldPassword = await encryptExtreme(oldPassword)
    }
    operation.record.fields.old = {"value":oldPassword}
  }
  if(currentPassword.fields.secret != null){
    if(isExtreme){
      currentPassword.fields.secret.value = await encryptExtreme(currentPassword.fields.secret.value)
    }
    operation.record.fields.secret = {"value":currentPassword.fields.secret.value}
  }
  if(currentPassword.fields.algorithm != null){
    if(isExtreme){
      currentPassword.fields.algorithm.value = await encryptExtreme(currentPassword.fields.algorithm.value)
    }
    operation.record.fields.algorithm = {"value":currentPassword.fields.algorithm.value}
  }
  if(currentPassword.fields.period != null){
    if(isExtreme){
      currentPassword.fields.period.value = await encryptExtreme(currentPassword.fields.period.value)
    }
    operation.record.fields.period = {"value":currentPassword.fields.period.value}
  }
  if(currentPassword.fields.digits != null){
    if(isExtreme){
      currentPassword.fields.digits.value = await encryptExtreme(currentPassword.fields.digits.value)
    }
    operation.record.fields.digits = {"value":currentPassword.fields.digits.value}
  }
  var executor = document.getElementById("vaulteditoptions");
  if(executor.selectedIndex != 0){
    var vaultid = vaults[executor.selectedIndex].recordName;
    operation.record.fields.vaultid = {"value":vaultid}
  }
  if(todasSenhas[editSelected-1].fields.shared){
    var enc = [];
    todasSenhas[editSelected-1].fields.shared.value.forEach(element => {
      enc.push(element);
    });
    operation.record.fields.shared = {"value":enc}
  }
  operations.push(operation)
  var query = { "operations":operations };
  xhr.send("{\"query\" : " + JSON.stringify(query) + "}");
}
function estatisticas(){
  window.location = 'estatisticas.html'
}
function pix(){
  window.location = "pix.html";
}
function gerarsenhaedit() {
  document.getElementById("advancedDiceEdit").hidden = false;
  var modaledit = $("#editarModal")
  var newPass = Password.generate(sliderEdit.value,maiusculasEdit.checked,minusculasEdit.checked,numerosEdit.checked,caracteresEdit.checked);
  modaledit.find('#senhaedit').val(newPass)
  updateInput(newPass)
}
var Password = {
  _pattern: /[a-zA-Z0-9_\-\+\.]/,
  _getRandomByte: function () {
    // http://caniuse.com/#feat=getrandomvalues
    if (window.crypto && window.crypto.getRandomValues) {
      var result = new Uint8Array(1);
      window.crypto.getRandomValues(result);
      return result[0];
    }
    else if (window.msCrypto && window.msCrypto.getRandomValues) {
      var result = new Uint8Array(1);
      window.msCrypto.getRandomValues(result);
      return result[0];
    }
    else {
      return Math.floor(Math.random() * 256);
    }
  },

  generate: function (length,mai,min,num,carac) {
    return Array.apply(null, { 'length': length })
      .map(function () {
        var result;
        var pat = "[";
        if(mai)pat = pat+"A-Z"
        if(min)pat = pat+"a-z"
        if(num)pat = pat+"0-9"
        if(carac)pat = pat+"_\\-\\+\\."
        pat = pat +"]"
        var pattern = new RegExp(pat,"g")
        if(pat != "[]"){
          while (true) {
            result = String.fromCharCode(this._getRandomByte());
            if (pattern.test(result)) {
              return result;
            }
          }
        } else {
          return "";
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
    sizeOfCharacterSet+=10;
  }
  if (ish.match(/[-{}()|'".:;,<>?!@#%]+/)){
    sizeOfCharacterSet+=20;
  }
  if (ish.match(/[$=+/€®ŧ←↓→øþæßðđŋħĸł»©“”µ]+/)){
    sizeOfCharacterSet+=10;
  }
  if (ish.match(/[ ]+/)){
    sizeOfCharacterSet+=1;
  }
  var entropy = Math.log2(sizeOfCharacterSet);
  var entropy = entropy * ish.length;
  if (entropy < 28) {
    strongedit.innerHTML = gettranslate("very_weak")
    strongedit.style.color = "#F4364C"
    return 0
  } else if (entropy < 36) {
    strongedit.innerHTML = gettranslate("weak")
    strongedit.style.color = "#F4364C"
    return 1
  } else if (entropy < 60) {
    strongedit.innerHTML = gettranslate("regular")
    strongedit.style.color = "#F5BB00"
    return 2
  } else if (entropy < 128) {
    strongedit.innerHTML = gettranslate("strong")
    strongedit.style.color = "#29bf12"
    return 3
  } else {
    strongedit.innerHTML = gettranslate("very_strong")
    strongedit.style.color = "#29bf12"
    return 4
  }
}
function alertas(){
  window.location = "alertas.html";
}
function doc(){
  window.location = "documents.html";
}
function translate(){
  document.getElementById("docsmenu").innerHTML = gettranslate("docsmenu");
    document.getElementById("loadinglabel").innerHTML = gettranslate("search_passwords");
    document.getElementById("nametitle").innerHTML = gettranslate("name");
    document.getElementById("observationtitle").innerHTML = gettranslate("strength");
    document.getElementById("passwordtitle").innerHTML = gettranslate("password");
    document.getElementById("showtitle").innerHTML = gettranslate("show");
    document.getElementById("copytitle").innerHTML = gettranslate("copy");
    document.getElementById("search").placeholder =  gettranslate("search_password");
    document.getElementById("page").placeholder = gettranslate("login_title");
    document.getElementById("passwordsmenu").innerHTML = gettranslate("passwordsmenu");
    document.getElementById("notesmenu").innerHTML = gettranslate("notesmenu");
    document.getElementById("logoutmenu").innerHTML = gettranslate("logoutmenu")
    document.getElementById("title").innerHTML = gettranslate("alerts");
    document.getElementById("alertsmenu").innerHTML = gettranslate("alertsmenu");
    document.getElementById("usersmenu2").innerHTML = gettranslate("usersmenu2");
    document.getElementById("estatisticasmenu2").innerHTML = gettranslate("estatisticasmenu2");
    document.getElementById("pixmenu").innerHTML = gettranslate("pixmenu");
    document.getElementById("edittitle").innerHTML = gettranslate("edit");
    document.getElementById("editModalLabel").innerHTML = gettranslate("edit_password");
    document.getElementById("nomeeditlabel").innerHTML = gettranslate("name");
    document.getElementById("senhaeditlabel").innerHTML = gettranslate("password");
    document.getElementById("usuarioeditlabel").innerHTML = gettranslate("username_label");
    document.getElementById("nomeedit").placeholder = gettranslate("ex_password_name");
    document.getElementById("senhaedit").placeholder = gettranslate("ex_note_desc");
    document.getElementById("usuarioedit").placeholder = gettranslate("ex_username");
    document.getElementById("canceledit").innerHTML = gettranslate("cancelbutton");
    document.getElementById("saveedit").innerHTML = gettranslate("savebutton");
    document.getElementById("uplabeledit").innerHTML = gettranslate("capital_letters");
    document.getElementById("downlabeledit").innerHTML = gettranslate("small_letters");
    document.getElementById("numberslabeledit").innerHTML = gettranslate("numbers");
    document.getElementById("characlabeledit").innerHTML = gettranslate("special_char");
    document.getElementById("lengthlabeledit").innerHTML = gettranslate("length");
    document.getElementById("descriptioneditlabel").innerHTML = gettranslate("description_label");
    document.getElementById("descriptionedit").placeholder = gettranslate("ex_note");
    document.getElementById("vaulteditlabel").innerHTML = gettranslate("vault");
}