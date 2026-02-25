var token = "";
var passwords;
var todasSenhas = [];
var todosUsuarios = [];
var numeroSenhas = 0;
var editSelected = 0;
var passwordPermissions = [];
var oldPermissions = [];
var enviado = 0;
var selectedUser = 0;
var selectedRows = [];
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
var slider = document.getElementById("myRange");
var output = document.getElementById("lengthPass");
var maiusculas = document.getElementById("maiusculas");
var minusculas = document.getElementById("minusculas");
var caracteres = document.getElementById("caracteres");
var numeros = document.getElementById("numeros");
var sliderEdit = document.getElementById("myRangeEdit");
var outputEdit = document.getElementById("lengthPassEdit");
var maiusculasEdit = document.getElementById("maiusculasEdit");
var minusculasEdit = document.getElementById("minusculasEdit");
var caracteresEdit = document.getElementById("caracteresEdit");
var numerosEdit = document.getElementById("numerosEdit");
var vaults = []
var isExtreme = false
async function totp(key ,secs = 30, digits = 6,algorithm = "SHA-1"){
	return hotp(unbase32(key), pack64bu(Date.now() / 1000 / secs), digits,algorithm)
  
}
async function hotp(key, counter, digits,algorithm){
	let y = self.crypto.subtle;
	if(!y) throw Error('no self.crypto.subtle object available');
	let k = await y.importKey('raw', key, {name: 'HMAC', hash: algorithm}, false, ['sign']);
	return hotp_truncate(await y.sign('HMAC', k, counter), digits);
}
function hotp_truncate(buf, digits){
	let a = new Uint8Array(buf), i = a[19] & 0xf;
	return fmt(10, digits, ((a[i]&0x7f)<<24 | a[i+1]<<16 | a[i+2]<<8 | a[i+3]) % 10**digits);
}

function fmt(base, width, num){
	return num.toString(base).padStart(width, '0')
}
function unbase32(s){
	let t = (s.toLowerCase().match(/\S/g)||[]).map(c => {
		let i = 'abcdefghijklmnopqrstuvwxyz234567'.indexOf(c);
		if(i < 0) throw Error(`bad char '${c}' in key`);
		return fmt(2, 5, i);
	}).join('');
	if(t.length < 8) throw Error('key too short');
	return new Uint8Array(t.match(/.{8}/g).map(d => parseInt(d, 2)));
}
function pack64bu(v){
	let b = new ArrayBuffer(8), d = new DataView(b);
	d.setUint32(0, v / 2**32);
	d.setUint32(4, v);
	return b;
}
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
};
function estatisticas(){
  window.location = 'estatisticas.html'
}
slider.oninput = function() {
  output.innerHTML = this.value;
}
slider.onchange = function() {
  gerarsenha()
}
maiusculas.onchange = function() {
  gerarsenha()
}
minusculas.onchange = function() {
  gerarsenha()
}
numeros.onchange = function() {
  gerarsenha()
}
caracteres.onchange = function() {
  gerarsenha()
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
async function getPasswords() {
  todasSenhas = [];
  var token = getCookie("tokenis");
  if (token == null || token == "") {
    window.location = 'login.html';
  }
  loadinglabel.innerHTML = gettranslate("search_passwords") + "...";
  var xhr = new XMLHttpRequest();
  var url = host + "/iSenhasBuscarSenhasV4";
  if (development) url = host + "/iSenhasBuscarSenhasV4DEV";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("authorization", token);

  xhr.onreadystatechange = async function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var objResponse = JSON.parse(xhr.responseText);
      var records = objResponse.passwords;

      if (records.length == 0) {
        var permission = getCookie("permission");
        if (permission == "ADMIN" || permission == "USER") {
          getUsers();
        } else {
          getVaults();
        }
      } else {
        await Promise.all(records.map(async (rec) => {
          var sharedItem = false
          if(rec.fields.admin){
              sharedItem = true
          }
          rec.fields.password.value = window.atob(rec.fields.password.value);
          if (isExtreme && !sharedItem) {
            rec.fields.password.value = await decryptExtreme(rec.fields.password.value);
          }
          if (isExtreme && !sharedItem) {
            rec.fields.name.value = await decryptExtreme(rec.fields.name.value);
          }
          if (rec.fields.observation) {
            if (isExtreme && !sharedItem) {
              rec.fields.observation.value = await decryptExtreme(rec.fields.observation.value);
            }
          }
          if (rec.fields.description) {
            if (isExtreme && !sharedItem) {
              rec.fields.description.value = await decryptExtreme(rec.fields.description.value);
            }
          }
          if (rec.fields.old) {
            rec.fields.old.value = window.atob(rec.fields.old.value);
            if (isExtreme && !sharedItem) {
              rec.fields.old.value = await decryptExtreme(rec.fields.old.value);
            }
          }
          if (rec.fields.secret) {
            if (isExtreme && !sharedItem) {
              rec.fields.secret.value = await decryptExtreme(rec.fields.secret.value);
            }
          }
          if (rec.fields.period) {
            if (isExtreme && !sharedItem) {
              rec.fields.period.value = await decryptExtreme(rec.fields.period.value);
            }
          }
          if (rec.fields.algorithm) {
            if (isExtreme && !sharedItem) {
              rec.fields.algorithm.value = await decryptExtreme(rec.fields.algorithm.value);
            }
          }
          if (rec.fields.digits) {
            if (isExtreme && !sharedItem) {
              rec.fields.digits.value = await decryptExtreme(rec.fields.digits.value);
            }
          }
        }));
        todasSenhas = records;
        loadinglabel.innerHTML = gettranslate("search_passwords") + ": " + todasSenhas.length;
        var permission = getCookie("permission");
        if (permission == "ADMIN" || permission == "USER") {
          getUsers();
        } else {
          getVaults();
        }
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

function getUsers() {
  todosUsuarios = [];
  var token = getCookie("tokenis");
  if (token == null || token == "") {
    window.location = 'login.html';
  }
  loadinglabel.innerHTML = gettranslate("search_users")+"...";
  var xhr = new XMLHttpRequest();
  var url = host+"/iSenhasBuscarUsuariosV4";
  if(development) url = host+"/iSenhasBuscarUsuariosV4DEV";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('authorization', token);

  xhr.onreadystatechange =  function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var objResponse = JSON.parse(xhr.responseText);
      var records = objResponse.users;
      if (records.length == 0) {
        limiter.style.display = "block";
        loading.style.display = "none";
      } else {
        todosUsuarios = records;
        loadinglabel.innerHTML = gettranslate("search_users")+": " + todosUsuarios.length;
        getVaults()
      }
    } else if (xhr.readyState === 4 && xhr.status === 401) {
      spinner.style.display = "none";
      window.location = 'login.html';
    }else if (xhr.readyState === 4) {
      spinner.style.display = "none";
      loadinglabel.innerHTML = gettranslate("search_users_error")+": " + xhr.status;
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
        setInterval(reloadProgress, 1000);
        reloadTable();
      } else {
        var isShared = false
        for (var i = 0; i < records.length; i++) {
          if(records[i].admin != null){
            isShared = true
          }
        }
        vaults = records;
        let vault = {"recordName":"0","name":gettranslate("personal")}
        vaults.unshift(vault)
        if(isShared){
          getShared()
        } else {
          limiter.style.display = "block";
          loading.style.display = "none";
          setInterval(reloadProgress, 1000);
          reloadTable();
        }
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
function getShared() {
  var token = getCookie("tokenis");
  if (token == null || token == "") {
    window.location = 'login.html';
  }
  loadinglabel.innerHTML = gettranslate("search_passwords")+"...";
  var xhr = new XMLHttpRequest();
  var url = host+"/iSenhasBuscarCofresCompartilhadoV4";
  if(development) url = host+"/iSenhasBuscarCofresCompartilhadoV4DEV";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('authorization', token);

  xhr.onreadystatechange =  function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var objResponse = JSON.parse(xhr.responseText);
      var records = objResponse.items;
      if (records.length == 0) {
        limiter.style.display = "block";
        loading.style.display = "none";
        setInterval(reloadProgress, 1000);
        reloadTable();
      } else {
        for(var i=0;i<records.length;i++){
          var decoded = records[i].fields.password.value
          records[i].fields.password.value = window.atob(decoded)
          if(records[i].fields.old)
            records[i].fields.old.value = window.atob(records[i].fields.old.value);
          records[i].sharedDesc = gettranslate("shared_by")+" "+ records[i].fields.user.value;
        }
        Array.prototype.push.apply(todasSenhas, records);
        limiter.style.display = "block";
        loading.style.display = "none";
        setInterval(reloadProgress, 1000);
        reloadTable();
      }
    } else if (xhr.readyState === 4 && xhr.status === 401) {
      spinner.style.display = "none";
      window.location = 'login.html';
    }else if (xhr.readyState === 4) {
      spinner.style.display = "none";
      loadinglabel.innerHTML = gettranslate("search_passwords_error")+": " + xhr.status;
    }
  };

  xhr.send(""+JSON.stringify({"type":"password"}));
}
async function reloadProgress(){
  var favorites = []
  var others = []
  for(var v=0;v<todasSenhas.length;v++){
    let fav = todasSenhas[v]["fields"]["favorite"]
    if(fav == null){
      others.push(todasSenhas[v])
    } else {
      favorites.push(todasSenhas[v])
    }
  }
  others.sort(function(a, b) {
    return (a.modified > b.modified) ? -1 : ((a.modified < b.modified) ? 1 : 0);
  });

  favorites.sort(function(a, b) {
    return (a.modified > b.modified) ? -1 : ((a.modified < b.modified) ? 1 : 0);
  });
  todasSenhas = []
  Array.prototype.push.apply(todasSenhas, favorites);
  Array.prototype.push.apply(todasSenhas, others);
  for(var i=0;i<todasSenhas.length;i++){
      let password = todasSenhas[i]
      if(password.fields.secret != null){
      let fields = password.fields
      
      const t = Date.now() / 1000;
      var v = Math.round(30 - (t % 30))
      let progressid = "circular-progress" + (i+1).toString()
      var progress = document.getElementById(progressid)
      let percent = (v/30)*100
      progress.style.background = `conic-gradient(#fff ${percent * 3.6}deg, #262628 0deg)`;
      let pvalue = "progress-value" + (i+1).toString()
      document.getElementById(pvalue).innerHTML = v.toString()
      var algorithm = fields.algorithm.value
      if(algorithm == "SHA1"){
        algorithm = "SHA-1"
      } else if (algorithm == "SHA256"){
        algorithm = "SHA-256"
      } else if (algorithm == "SHA512"){
        algorithm = "SHA-512"
      }
      try{
        let value = await totp(fields.secret.value,fields.period.value,fields.digits.value,algorithm)
        let code = "code" + (i+1).toString()
        document.getElementById(code).innerHTML = value
      } catch (error){
        console.log(error)
      }
    } 
  }
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
function refreshOptionsVault(){
  var d = document.getElementById("vaultaddoptions");
  removeAll(d)
  vaults.forEach(vault => {
    var vaultid = vault.recordName;
    var name = vault.name;
    var option = document.createElement("option");
      option.text = name
      option.value = vaultid
      option.tag
      d.add(option);
  });
  $("#vaultaddoptions").selectpicker("refresh");

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
async function reloadTable(){
    $('#table-body').empty();
    selectedRows = [];
    document.getElementById("title").innerHTML =gettranslate("passwords") +" ("+todasSenhas.length+") ";
    var permission = getCookie("permission");
    var favorites = []
    var others = []
    for(var v=0;v<todasSenhas.length;v++){
      let fav = todasSenhas[v]["fields"]["favorite"]
      if(fav == null){
        others.push(todasSenhas[v])
      } else {
        favorites.push(todasSenhas[v])
      }
    }
    others.sort(function(a, b) {
      return (a.modified > b.modified) ? -1 : ((a.modified < b.modified) ? 1 : 0);
    });

    favorites.sort(function(a, b) {
      return (a.modified > b.modified) ? -1 : ((a.modified < b.modified) ? 1 : 0);
    });
    todasSenhas = []
    Array.prototype.push.apply(todasSenhas, favorites);
    Array.prototype.push.apply(todasSenhas, others);
    if(permission == "ADMIN" || permission == "USER"){
      for(var i=0;i<todasSenhas.length;i++){
        var password = todasSenhas[i];
        var named = password.fields.name.value;
        var observation = "-";
        var description = "-";
        var type = "-";
        if(password.fields.observation !=null)observation = password.fields.observation.value;
        if(password.fields.description !=null)description = password.fields.description.value;
        if(description.length == 0)description = "-"
        if(observation.length == 0)observation = "-"
        if(password.fields.type !=null)type = password.fields.type.value;
        var pass = password.fields.password.value;
        var image = getListIconFromText(named).image;
        if(type == "note") image = "note";
        var display_star = "none"
        if(password.fields.favorite !=null)display_star = "block"
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
        if(!password.fields.admin && !password.sharedDesc){        
          $('#table-body').append(`
                  <tr class="rows" id='${i+1}'>            
                    <td class= "info" id="name${i + 1}">
                    <div style="display: flex;">   
                      <img style="display:${display_star};position:absolute;z-index: 1000;height:14px;margin-right:10px;" alt="Qries" src="../images/iconsmart/star.png" data-toggle="modal" data-target="#exampleModal" data-whatever="@fat"/>
                      <img style="height:24px;margin-right:10px;" alt="Qries" src="../images/iconsmart/${image}.png" data-toggle="modal" data-target="#exampleModal" data-whatever="@fat" onClick= "copy(${i + 1})"/>
                    <div>
                    <div>${named}</div>
                      <div id="passvault${i + 1}" style="font-size:10px;margin-top:5px;display:${display}">${vaultName}</div>
                    </div>
                     </div>
                    </td>
                    <td class= "info" id="observation" onclick="select(${i+1})">${observation}</td>
                    <td class= "info" id="pass" onclick="select(${i+1})">
                      <input id="password" class="passwordRow" type="password" value="${pass}" readonly/>
                      <div id="dash${i+1}" onclick="select(${i+1})">━━━━━━━━━━</div>
                      <div  style="display:flex">
                        <div id="code${i+1}" onclick="select(${i+1})">-</div>
                        <div class="circular-progress" id="circular-progress${i+1}">
                          <span class="progress-value" id="progress-value${i+1}">50</span>
                        </div>
                      </div>
                    </td>     
                  <td class= "info" id="pass" onclick="select(${i+1})"><textarea rows="1" id="description" class="passwordRow" readonly>${description}</textarea></td>
                  <td class= "info" style="text-align:left;">
                      <i class="far fa-eye-slash" onClick= "showHide(${i+1})"></i>
                  </td> 
                  <td class= "info" style="display:block"> 
                    <i class="far fa-copy" onClick= "copy(${i+1})"></i>
                    <div id="dashe${i+1}" onclick="select(${i+1})">━</div>
                    <i id="copye${i+1}" class="far fa-copy" onClick= "copye(${i+1})"></i>
                  </td>
                  <td class= "info" style="text-align:left;">
                  <i class="far fa-edit" onClick= "edit(${i+1})"></i>
                  </td>
                  <td class= "info" id="recordName" onclick="select(${i+1})" style="display: none;">${password.recordName}</td>
                  <td class= "info" id="recordChangeTag" onclick="select(${i+1})" style="display: none;">${password.recordChangeTag}</td>
                  <td class= "info" style="text-align:left;">
                  <i class="fa fa-share" onClick= "share(${i+1})"></i>
                  </td>
                  </tr>
              `)
              if(password.fields.secret != null){
                let fields = password.fields
                var algorithm = fields.algorithm.value
                if(algorithm == "SHA1"){
                  algorithm = "SHA-1"
                } else if (algorithm == "SHA256"){
                  algorithm = "SHA-256"
                } else if (algorithm == "SHA512"){
                  algorithm = "SHA-512"
                }
                try{
                  let value = await totp(fields.secret.value,fields.period.value,fields.digits.value,algorithm)
                  let code = "code" + (i+1).toString()
                  document.getElementById(code).innerHTML = value
                } catch {

                }
                const t = Date.now() / 1000;
                var v = Math.round(30 - (t % 30))
                let progressid = "circular-progress" + (i+1).toString()
                var progress = document.getElementById(progressid)
                let percent = (v/30)*100
                progress.style.background = `conic-gradient(#fff ${percent * 3.6}deg, #262628 0deg)`;
                let pvalue = "progress-value" + (i+1).toString()
                document.getElementById(pvalue).innerHTML = v.toString()
              } else {
                let code = "code" + (i+1).toString()
                removeElement(code)
                let progressid = "circular-progress" + (i+1).toString()
                removeElement(progressid)
                let dash = "dash" + (i+1).toString()
                removeElement(dash)
                let copy2 = "copye" + (i+1).toString()
                removeElement(copy2)
                let dash2 = "dashe" + (i+1).toString()
                removeElement(dash2)
              }
        } else {
          var subtitle = "" 
            if(password.fields.admin != null)
              subtitle = gettranslate("shared_by")+" "+password.fields.admin.value
            else
              subtitle = password.sharedDesc
          $('#table-body').append(`
            <tr class="rows" id='${i+1}'>     
                  
              <td class= "info" id="name" onclick="select(${i+1})">
                <div style="display: flex;">   
                  <img style="height:24px;margin-right:10px;" alt="Qries" src="../images/iconsmart/${image}.png" data-toggle="modal" data-target="#exampleModal" data-whatever="@fat" onClick= "copy(${i+1})"/>
                  <div>
                  <div>${named}</div>
                  <div id="passdesc${i+1}" style="font-size:12px;">${subtitle}</div>
                  </div>
                </div>
              </td>
              <td class= "info" id="observation" onclick="select(${i+1})">${observation}</td>
              <td class= "info" id="pass" onclick="select(${i+1})">
                      <input id="password" class="passwordRow" type="password" value="${pass}" readonly/>
                      <div id="dash${i+1}" onclick="select(${i+1})">━━━━━━━━━━</div>
                      <div  style="display:flex">
                        <div id="code${i+1}" onclick="select(${i+1})">-</div>
                        <div class="circular-progress" id="circular-progress${i+1}">
                          <span class="progress-value" id="progress-value${i+1}">50</span>
                        </div>
                      </div>
              </td>  
              <td class= "info" id="pass" onclick="select(${i+1})"><textarea rows="1" id="description" class="passwordRow" readonly>${description}</textarea></td>
            <td class= "info" style="text-align:left;">
                <i class="far fa-eye-slash" onClick= "showHide(${i+1})"></i>
            </td> 
            <td class= "info" style="display:block"> 
                    <i class="far fa-copy" onClick= "copy(${i+1})"></i>
                    <div id="dashe${i+1}" onclick="select(${i+1})">━</div>
                    <i id="copye${i+1}" class="far fa-copy" onClick= "copye(${i+1})"></i>
                  </td>
            <td class= "info" style="text-align:left;">
            <i class="far fa-edit" onClick= "edit(${i+1})"></i>
            </td>
            <td class= "info" id="recordName" onclick="select(${i+1})" style="display: none;">${password.recordName}</td>
            <td class= "info" id="recordChangeTag" onclick="select(${i+1})" style="display: none;">${password.recordChangeTag}</td>
            <td class= "info" style="text-align:left;">
            <i class="fa fa-share" onClick= "share(${i+1})"></i>
            </td>
            </tr>
        `)
        if(password.fields.secret != null){
          let fields = password.fields
          var algorithm = fields.algorithm.value
          if(algorithm == "SHA1"){
            algorithm = "SHA-1"
          } else if (algorithm == "SHA256"){
            algorithm = "SHA-256"
          } else if (algorithm == "SHA512"){
            algorithm = "SHA-512"
          }
          try{
            let value = await totp(fields.secret.value,fields.period.value,fields.digits.value,algorithm)
            let code = "code" + (i+1).toString()
            document.getElementById(code).innerHTML = value
          } catch {

          }
          const t = Date.now() / 1000;
          var v = Math.round(30 - (t % 30))
          let progressid = "circular-progress" + (i+1).toString()
          var progress = document.getElementById(progressid)
          let percent = (v/30)*100
          progress.style.background = `conic-gradient(#fff ${percent * 3.6}deg, #262628 0deg)`;
          let pvalue = "progress-value" + (i+1).toString()
          document.getElementById(pvalue).innerHTML = v.toString()
        } else {
          let code = "code" + (i+1).toString()
          removeElement(code)
          let progressid = "circular-progress" + (i+1).toString()
          removeElement(progressid)
          let dash = "dash" + (i+1).toString()
          removeElement(dash)
          let copy2 = "copye" + (i+1).toString()
          removeElement(copy2)
          let dash2 = "dashe" + (i+1).toString()
          removeElement(dash2)
        }
        }
      }
    } else {
      //document.getElementById("sharetitle").style.display = "none";
      for(var i=0;i<todasSenhas.length;i++){
        var password = todasSenhas[i];
        var named = password.fields.name.value;
        var observation = "-";
        var description = "-";
        var type = "-";
        if(password.fields.observation !=null)observation = password.fields.observation.value;
        if(observation.length == 0)observation = "-"
        if(password.fields.description !=null)description = password.fields.description.value;
        if(description.length == 0)description = "-"
        if(password.fields.type !=null)type = password.fields.type.value;
        var pass = password.fields.password.value;
        var image = getListIconFromText(named).image;
        if(type == "note") image = "note";
        var display_star = "none"
        if(password.fields.favorite !=null)display_star = "block"
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
        if(!password.fields.admin && !password.sharedDesc){        
          $('#table-body').append(`
                  <tr class="rows" id='${i+1}'>            
                    <td class= "info" id="name${i + 1}">
                    <div style="display: flex;">   
                      <img style="display:${display_star};position:absolute;z-index: 1000;height:14px;margin-right:10px;" alt="Qries" src="../images/iconsmart/star.png" data-toggle="modal" data-target="#exampleModal" data-whatever="@fat"/>
                      <img style="height:24px;margin-right:10px;" alt="Qries" src="../images/iconsmart/${image}.png" data-toggle="modal" data-target="#exampleModal" data-whatever="@fat" onClick= "copy(${i + 1})"/>
                    <div>
                    <div>${named}</div>
                      <div id="passvault${i + 1}" style="font-size:10px;margin-top:5px;display:${display}">${vaultName}</div>
                    </div>
                     </div>
                    </td>
                    <td class= "info" id="observation" onclick="select(${i+1})">${observation}</td>
                    <td class= "info" id="pass" onclick="select(${i+1})">
                      <input id="password" class="passwordRow" type="password" value="${pass}" readonly/>
                      <div id="dash${i+1}" onclick="select(${i+1})">━━━━━━━━━━</div>
                      <div  style="display:flex">
                        <div id="code${i+1}" onclick="select(${i+1})">-</div>
                        <div class="circular-progress" id="circular-progress${i+1}">
                          <span class="progress-value" id="progress-value${i+1}">50</span>
                        </div>
                      </div>
                    </td>
                    <td class= "info" id="pass" onclick="select(${i+1})"><textarea rows="1" id="description" class="passwordRow" readonly>${description}</textarea></td>
                  <td class= "info" style="text-align:left;">
                      <i class="far fa-eye-slash" onClick= "showHide(${i+1})"></i>
                  </td> 
                  <td class= "info" style="display:block"> 
                    <i class="far fa-copy" onClick= "copy(${i+1})"></i>
                    <div id="dashe${i+1}" onclick="select(${i+1})">━</div>
                    <i id="copye${i+1}" class="far fa-copy" onClick= "copye(${i+1})"></i>
                  </td>
                  <td class= "info" style="text-align:left;">
                  <i class="far fa-edit" onClick= "edit(${i+1})"></i>
                  </td>
                  <td class= "info" id="recordName" onclick="select(${i+1})" style="display: none;">${password.recordName}</td>
                  <td class= "info" id="recordChangeTag" onclick="select(${i+1})" style="display: none;">${password.recordChangeTag}</td>
                  <td class= "info" style="text-align:left;">
                  <i class="fa fa-share" onClick= "sharepremium(${i+1})"></i>
                  </td>
                  </tr>
              `)
              if(password.fields.secret != null){
                let fields = password.fields
                var algorithm = fields.algorithm.value
                if(algorithm == "SHA1"){
                  algorithm = "SHA-1"
                } else if (algorithm == "SHA256"){
                  algorithm = "SHA-256"
                } else if (algorithm == "SHA512"){
                  algorithm = "SHA-512"
                }
                try{
                let value = await totp(fields.secret.value,fields.period.value,fields.digits.value,algorithm)
                let code = "code" + (i+1).toString()
                document.getElementById(code).innerHTML = value
                } catch {

                }
                const t = Date.now() / 1000;
                var v = Math.round(30 - (t % 30))
                let progressid = "circular-progress" + (i+1).toString()
                var progress = document.getElementById(progressid)
                let percent = (v/30)*100
                progress.style.background = `conic-gradient(#fff ${percent * 3.6}deg, #262628 0deg)`;
                let pvalue = "progress-value" + (i+1).toString()
                document.getElementById(pvalue).innerHTML = v.toString()
              } else {
                let code = "code" + (i+1).toString()
                removeElement(code)
                let progressid = "circular-progress" + (i+1).toString()
                removeElement(progressid)
                let dash = "dash" + (i+1).toString()
                removeElement(dash)
                let copy2 = "copye" + (i+1).toString()
                removeElement(copy2)
                let dash2 = "dashe" + (i+1).toString()
                removeElement(dash2)
              }
          } else {
            var subtitle = "" 
            if(password.fields.admin != null)
              subtitle = gettranslate("shared_by")+" "+password.fields.admin.value
            else
              subtitle = password.sharedDesc
            $('#table-body').append(`
            <tr class="rows" id='${i+1}'>     
                  
              <td class= "info" id="name" onclick="select(${i+1})">
                <div style="display: flex;">   
                  <img style="height:24px;margin-right:10px;" alt="Qries" src="../images/iconsmart/${image}.png" data-toggle="modal" data-target="#exampleModal" data-whatever="@fat" onClick= "copy(${i+1})"/>
                  <div>
                  <div>${named}</div>
                  <div id="passdesc${i+1}" style="font-size:12px;">${subtitle}</div>
                  </div>
                </div>
              </td>
              <td class= "info" id="observation" onclick="select(${i+1})">${observation}</td>
              <td class= "info" id="pass" onclick="select(${i+1})">
                <input id="password" class="passwordRow" type="password" value="${pass}" readonly/>
                <div id="dash${i+1}" onclick="select(${i+1})">━━━━━━━━━━</div>
                <div  style="display:flex">
                  <div id="code${i+1}" onclick="select(${i+1})">-</div>
                  <div class="circular-progress" id="circular-progress${i+1}">
                    <span class="progress-value" id="progress-value${i+1}">50</span>
                  </div>
                </div>
              </td>
              <td class= "info" id="pass" onclick="select(${i+1})"><textarea rows="1" id="description" class="passwordRow" readonly>${description}</textarea></td>
            <td class= "info" style="text-align:left;">
                <i class="far fa-eye-slash" onClick= "showHide(${i+1})"></i>
            </td> 
            <td class= "info" style="display:block"> 
                    <i class="far fa-copy" onClick= "copy(${i+1})"></i>
                    <div id="dashe${i+1}" onclick="select(${i+1})">━</div>
                    <i id="copye${i+1}" class="far fa-copy" onClick= "copye(${i+1})"></i>
                  </td>
            <td class= "info" style="text-align:left;">
            <i class="far fa-edit" onClick= "edit(${i+1})"></i>
            </td>
            <td class= "info" id="recordName" onclick="select(${i+1})" style="display: none;">${password.recordName}</td>
            <td class= "info" id="recordChangeTag" onclick="select(${i+1})" style="display: none;">${password.recordChangeTag}</td>
            <td class= "info" style="text-align:left;">
            <i class="fa fa-share" onClick= "share(${i+1})"></i>
            </td>
            </tr>
        `)
          if(password.fields.secret != null){
            let fields = password.fields
            var algorithm = fields.algorithm.value
            if(algorithm == "SHA1"){
              algorithm = "SHA-1"
            } else if (algorithm == "SHA256"){
              algorithm = "SHA-256"
            } else if (algorithm == "SHA512"){
              algorithm = "SHA-512"
            }
            try{
            let value = await totp(fields.secret.value,fields.period.value,fields.digits.value,algorithm)
            let code = "code" + (i+1).toString()
            document.getElementById(code).innerHTML = value
            } catch {
              
            }
            const t = Date.now() / 1000;
            var v = Math.round(30 - (t % 30))
            let progressid = "circular-progress" + (i+1).toString()
            var progress = document.getElementById(progressid)
            let percent = (v/30)*100
            progress.style.background = `conic-gradient(#fff ${percent * 3.6}deg, #262628 0deg)`;
            let pvalue = "progress-value" + (i+1).toString()
            document.getElementById(pvalue).innerHTML = v.toString()
          } else {
            let code = "code" + (i+1).toString()
            removeElement(code)
            let progressid = "circular-progress" + (i+1).toString()
            removeElement(progressid)
            let dash = "dash" + (i+1).toString()
            removeElement(dash)
            let copy2 = "copye" + (i+1).toString()
            removeElement(copy2)
            let dash2 = "dashe" + (i+1).toString()
            removeElement(dash2)
          }
        }
      }
    }
    loading.style.display = "none";
    limiter.style.display = "block";
    refreshOptionsVault();
}
function removeElement(id) {
  var elem = document.getElementById(id);
  return elem.parentNode.removeChild(elem);
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
  var tdimage = tr[id].getElementsByTagName("td")[4];
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
  var tdimage = tr[id].getElementsByTagName("td")[5];

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
function copye(id){
  var tr = table.getElementsByTagName("tr");
  var td = tr[id].getElementsByTagName("td")[2];
  var tdimage = tr[id].getElementsByTagName("td")[5];
  if(td){
    var a = td.getElementsByTagName("div")[1];
    var p = a.getElementsByTagName("div")[0];

    var img = tdimage.getElementsByTagName("i")[1];
    img.className = "fas fa-copy";
    img.style.color = "#29bf12"
    var variable = p.innerHTML
    navigator.clipboard.writeText(variable);
    setTimeout(() => { img.className = "far fa-copy"; 
    img.style.color = "#fff"
    }, 1000);
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
        if(originalIndex != id){
          filterSelected.push(selectedRows[ele]);
        }
      }
      selectedRows = filterSelected;
    } else {
      td.className = "selected"
      var recordName = tr[id].getElementsByTagName("td")[7].innerHTML;
      var recordChangeTag = tr[id].getElementsByTagName("td")[8].innerHTML;
      if(document.getElementById("passdesc"+id)) selectedRows.push({"originalIndex":id,"element":{"recordName":recordName,"recordChangeTag":recordChangeTag,"sharedDesc":document.getElementById("passdesc"+id).innerHTML}})
      else selectedRows.push({"originalIndex":id,"element":{"recordName":recordName,"recordChangeTag":recordChangeTag}})
    }
  }
  console.log(selectedRows)
}
function add(){
  var modal = $("#addModal")
    modal.find('#nomeadd').val("")
    modal.find('#senhaadd').val("")
    modal.find('#usuarioadd').val("")
    strong.innerHTML = "-"
    strong.style.color = "#FFF"
    document.getElementById("advancedDice").hidden = true;
  $("#addModal").modal();
}
function buttonadicionar(){
  var modal = $("#addModal")
  if(modal.find('#nomeadd').val().length == 0){
    document.getElementById("nomeaddlabel").style.color = "#F4364C"
    return;
  }else{
    document.getElementById("nomeaddlabel").style.color = "white"
  }
  if(modal.find('#senhaadd').val().length == 0){
    document.getElementById("senhaaddlabel").style.color = "#F4364C"
    return;
  } else {
    document.getElementById("senhaaddlabel").style.color = "white"
  }
  modal.modal("hide")
  loading.style.display = "block";
  limiter.style.display = "none";
  addSenha();
}
async function addSenha() {
  var token = getCookie("tokenis");
  if (token == null || token == "") {
    window.location = 'login.html';
  }
  loadinglabel.innerHTML = gettranslate("add_password") + "...";
  var xhr = new XMLHttpRequest();
  var url = host + "/iSenhasAddSenhaV4";
  if (development) url = host + "/iSenhasAddSenhaV4DEV";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("authorization", token);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      limiter.style.display = "none";
      loading.style.display = "block";
      getPasswords();
    } else if (xhr.readyState === 4) {
      spinner.style.display = "none";
      var language = navigator.language || navigator.userLanguage;
      loadinglabel.innerHTML = gettranslate("add_password_error") + ": " + xhr.status;
    }
  };
  var modal = $("#addModal");
  let myName = modal.find("#nomeadd").val();
  if (isExtreme) {
    myName = await encryptExtreme(myName);
  }
  let observation = modal.find("#usuarioadd").val();
  if (observation.length != 0) {
    if (isExtreme) {
      observation = await encryptExtreme(observation);
    }
  }
  let description = modal.find("#descriptionadd").val();
  if (description.length != 0) {
    if (isExtreme) {
      description = await encryptExtreme(description);
    }
  }
  let myPassword = modal.find("#senhaadd").val();
  if (myPassword.length != 0) {
    if (isExtreme) {
      myPassword = await encryptExtreme(myPassword);
    }
  }
  var query = {
    element: {
      name: myName,
      observation: observation,
      description: description,
      password: myPassword,
    },
  };
  var executor = document.getElementById("vaultaddoptions");
  if (executor.selectedIndex != 0) {
    var vaultid = vaults[executor.selectedIndex].recordName;
    query.element.vaultid = vaultid
  }

  xhr.send("" + JSON.stringify(query));
}
function share(id){
  selectedUser = id;
  var password = todasSenhas[id-1];
  if(password.fields.admin || password.sharedDesc || isExtreme){
    $("#shareErrorModal").modal();
  } else {
    document.getElementById("shareModalLabel").innerHTML = gettranslate("share")+" - "+password.fields.name.value;
    $('#table-body-share').empty();
    var i = 0;
    passwordPermissions = [];
    oldPermissions = [];
    if(password.fields.shared){
      Array.prototype.push.apply(passwordPermissions, password.fields.shared.value);
      Array.prototype.push.apply(oldPermissions, password.fields.shared.value);
      password.fields.shared.value.forEach(element =>{
        $('#table-body-share').append(`
                    <tr class="rows"id="row${i}" >            
                      <td class= "info" id="email${i}" >${element}</td>
                      <td class= "info"  style="text-align:left;" onClick= "userremove(${i})">
                        <i class="fa fa-trash-o onClick= "userremove(${i})"></i>
                      </td>
                    </tr>
                `)
        i++;
      });
    }
    refreshOptions();
    $("#shareModal").modal();
  }
}
function sharepremium(id){
  selectedUser = id;
  var password = todasSenhas[id-1];
  if(password.fields.admin || password.sharedDesc || isExtreme){
    $("#shareErrorModal").modal();
  } else {
    document.getElementById("shareModalLabelPremium").innerHTML = gettranslate("share")+" - "+password.fields.name.value;
    $('#table-body-share-premium').empty();
    var i = 0;
    passwordPermissions = [];
    oldPermissions = [];
    if(password.fields.shared){
      Array.prototype.push.apply(passwordPermissions, password.fields.shared.value);
      Array.prototype.push.apply(oldPermissions, password.fields.shared.value);
      password.fields.shared.value.forEach(element =>{
        $('#table-body-share-premium').append(`
                    <tr class="rows"id="rowpremium${i}" >            
                      <td class= "info" id="emailpremium${i}" >${element}</td>
                      <td class= "info"  style="text-align:left;" onClick= "userremovepremium(${i})">
                        <i class="fa fa-trash-o onClick= "userremovepremium(${i})"></i>
                      </td>
                    </tr>
                `)
        i++;
      });
    }
    document.getElementById("emailsharepremium").value = "";
    $("#shareModalPremium").modal();
  }
}
function refreshOptions(){
  var filter = [];
    var permissions = [];
    var password = todasSenhas[selectedUser-1];
    Array.prototype.push.apply(permissions, passwordPermissions);
    Array.prototype.push.apply(permissions, [password.fields.user.value]);

    todosUsuarios.forEach(element => {
      var mail = element.email;
      var contain = false;
      permissions.forEach(element2 => {
        if(element2 == mail)contain = true;
      });
      if(!contain)filter.push(element);
    });
    var d = document.getElementById("sharedoptions");
    removeAll(d)
    if(filter.length == 0){
      document.getElementById('mailLabel').style.display = 'none';
      document.getElementById('selectormail').style.display = 'none';

    } else {
      document.getElementById('selectormail').style.display = '';
      document.getElementById('mailLabel').style.display = '';
      filter.forEach(element => {
        var option = document.createElement("option");
        option.text = element.email;
        d.add(option);
      });
      $("#sharedoptions").selectpicker("refresh");
    }
      
    
      
  
}
function addshare(){
  var executor = document.getElementById("sharedoptions");
  var usertransfer = executor.options[executor.selectedIndex].text;
  passwordPermissions.push(usertransfer);
  refreshOptions();
  $('#table-body-share').empty();
    var i = 0;
    passwordPermissions.forEach(element =>{
      $('#table-body-share').append(`
                  <tr class="rows" id="row${i}">            
                    <td class= "info" id="email${i}" >${element}</td>
                    <td class= "info"  style="text-align:left;" onClick= "userremove(${i})">
                      <i class="fa fa-trash-o onClick= "userremove(${i})"></i>
                    </td>
                  </tr>
              `)
      i++;
    });
}
function addsharepremium(){
  var executor = document.getElementById("emailsharepremium");
  //var usertransfer = executor.options[executor.selectedIndex].text;
  passwordPermissions.push(executor.value);
  $('#table-body-share-premium').empty();
    var i = 0;
    passwordPermissions.forEach(element =>{
      $('#table-body-share-premium').append(`
                  <tr class="rows" id="rowpremium${i}">            
                    <td class= "info" id="emailpremium${i}" >${element}</td>
                    <td class= "info"  style="text-align:left;" onClick= "userremovepremium(${i})">
                      <i class="fa fa-trash-o onClick= "userremovepremium(${i})"></i>
                    </td>
                  </tr>
              `)
      i++;
    });
    document.getElementById("emailsharepremium").value = "";
}
function userremove(id){
  var email = document.getElementById("email"+id).innerHTML;
  var password = todasSenhas[selectedUser-1];
  var filtered = passwordPermissions.filter(function(value, index, arr){ 
    return value != email;
  });
  passwordPermissions = filtered;
  refreshOptions();
  document.getElementById("row"+id).remove();

}
function userremovepremium(id){
  var email = document.getElementById("emailpremium"+id).innerHTML;
  var password = todasSenhas[selectedUser-1];
  var filtered = passwordPermissions.filter(function(value, index, arr){ 
    return value != email;
  });
  passwordPermissions = filtered;
  document.getElementById("rowpremium"+id).remove();

}
function buttonshare(){
  $('#shareModal').modal('hide');
  loading.style.display = "block";
  loadinglabel.style.display = "block";
  limiter.style.display = "none";
  atualizarSenha()
}
function buttonsharepremium(){
  $('#shareModalPremium').modal('hide');
  loading.style.display = "block";
  loadinglabel.style.display = "block";
  limiter.style.display = "none";
  atualizarSenha()
}
function atualizarSenha() {
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
      getPasswords();
    } else if (xhr.readyState === 4) {
      spinner.style.display = "none";
      loadinglabel.innerHTML = gettranslate("update_password_error")+": " + xhr.status;
    }
  };
  var enc = [];
  passwordPermissions.forEach(element => {
    enc.push(element);
  });
  var favorite = todasSenhas[selectedUser-1].fields.favorite
  var operations = [];
  var operation = {"record":{"recordName":todasSenhas[selectedUser-1].recordName,"recordChangeTag":todasSenhas[selectedUser-1].recordChangeTag,"recordType":"passwords",
  "fields":{
  "shared":{"value":enc}
  }},"operationType":"update"};
  if(favorite != null){
    operation.record.fields.favorite = {"value":"ok"}
  }
  operations.push(operation)
  var query = { "operations":operations };
  xhr.send("{\"query\" : " + JSON.stringify(query) + "}");
}
function removeAll(selectBox) {
  while (selectBox.options.length > 0) {
      selectBox.remove(0);
  }
}
function excluir(){
    $("#excluirModal").modal();
}
function buttonremove(){
  loading.style.display = "block";
  limiter.style.display = "none";
  if(selectedRows.length==0){
    loadinglabel.innerHTML = gettranslate("no_password_selected");
    setTimeout(() => {
      loading.style.display = "none";
      loadinglabel.style.display = "none";
      limiter.style.display = "block";
  }, 2000);
    return;
  }
  enviado = 0;
  excluirSenhas();
}
function excluirSenhas() {
  var token = getCookie("tokenis");
  if (token == null || token == "") {
    window.location = 'login.html';
  }
  loadinglabel.innerHTML = gettranslate("remove_password")+": "+enviado;
  var xhr = new XMLHttpRequest();
  var url = host+"/iSenhasExcluirV4";
  if(development) url = host+"/iSenhasExcluirV4DEV";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('authorization', token);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      if(selectedRows.length>200){
        enviado = enviado +200;
        selectedRows.splice(0, 200); 
        excluirSenhas();
      } else {
        todasSenhas = [];
        selectedRows = [];
        getPasswords();
      }
    } else if (xhr.readyState === 4) {
      spinner.style.display = "none";
      var language = navigator.language || navigator.userLanguage;
      loadinglabel.innerHTML = gettranslate("remove_password_error")+": " + xhr.status;
    }
  };
  var operations = [];
  var forvalue = 200;
  if(selectedRows.length<200)forvalue = selectedRows.length;  
  console.log("selectedrows = "+forvalue)
  for(var z=0;z<forvalue;z++) {
    var element = selectedRows[z].element;
    var operation = {"record":{"recordName":element.recordName,"recordChangeTag":element.recordChangeTag,"recordType":"passwords"},"operationType":"delete"};
    if(element.sharedDesc){
      var shared = [];
      todasSenhas.forEach(sen => {
        if(sen.recordName == element.recordName){
          shared = sen.fields.shared.value;
        }
      });
     
      operation = {"record":{"recordName":element.recordName,"recordChangeTag":element.recordChangeTag,"recordType":"passwords","fields":{
        "shared":{"value":shared}
        }},"operationType":"update"};
    }
    operations.push(operation)
  }
  var query = { "operations":operations };
  xhr.send("{\"query\" : " + JSON.stringify(query) + "}");
}
function edit(id){
  var password = todasSenhas[id-1];
  if(password.fields.admin){
    $("#shareErrorModal").modal();
  } else {
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
      let originalid = vault.originalid
      if(currentvaultid == myid || currentvaultid == originalid){
        vaultid = myid
      }
    }
    const select = document.getElementById('vaulteditoptions');
    select.value = vaultid;
    select.dispatchEvent(new Event('change'));
    
    if(password.sharedDesc != null){
      select.disabled = true;
      document.getElementById("vaulteditlabel").style.color = "grey"
      $("#vaulteditoptions").selectpicker("refresh");
    } else {
      select.disabled = false;
      document.getElementById("vaulteditlabel").style.color = "white"
      $("#vaulteditoptions").selectpicker("refresh");
    }
    modal.find('#nomeedit').val(todasSenhas[id-1].fields.name.value)
    modal.find('#senhaedit').val(todasSenhas[id-1].fields.password.value)
    modal.find('#usuarioedit').val(observation)
    modal.find('#descriptionedit').val(description)
    updateInput(todasSenhas[id-1].fields.password.value)
    let translator = gettranslate("favorite_password")
    if(password.sharedDesc == null){
      var favswitch = document.getElementById("favswitch")
      favswitch.hidden = false
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
    } else {
      var favswitch = document.getElementById("favswitch")
      if(favswitch != null){
        favswitch.hidden = true
      }
    }
    editSelected = id;
    $("#editarModal").modal();
  }
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
    } else if (xhr.readyState === 4 && xhr.status == 409) {
      spinner.style.display = "none";
      loadinglabel.innerHTML = gettranslate("update_shared_password")+": " + xhr.status;
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
  if(favorite != null && favorite.checked){
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
function gerarsenha() {
  document.getElementById("advancedDice").hidden = false;
  var modaledit = $("#editarModal")
  var newPass = Password.generate(slider.value,maiusculas.checked,minusculas.checked,numeros.checked,caracteres.checked);
  var modal = $("#addModal")
  modal.find('#senhaadd').val(newPass)
  updateInput(newPass)
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
function pix(){
  window.location = "pix.html";
}
function doc(){
  window.location = "documents.html";
}
function translate(){
    document.getElementById("loadinglabel").innerHTML = gettranslate("search_passwords")+"...";
    document.getElementById("nametitle").innerHTML = gettranslate("name");
    document.getElementById("observationtitle").innerHTML = gettranslate("username");
    document.getElementById("descriptiontitle").innerHTML = gettranslate("description_title");
    document.getElementById("passwordtitle").innerHTML = gettranslate("password");
    document.getElementById("showtitle").innerHTML = gettranslate("show");
    document.getElementById("copytitle").innerHTML = gettranslate("copy");
    document.getElementById("search").placeholder = gettranslate("search_password");
    document.getElementById("page").placeholder = gettranslate("login_title");
    document.getElementById("edittitle").innerHTML = gettranslate("edit");
    document.getElementById("passwordsmenu").innerHTML = gettranslate("passwordsmenu");
    document.getElementById("notesmenu").innerHTML = gettranslate("notesmenu");
    document.getElementById("docsmenu").innerHTML = gettranslate("docsmenu");
    document.getElementById("logoutmenu").innerHTML = gettranslate("logoutmenu");
    document.getElementById("title").innerHTML = gettranslate("passwords");
    document.getElementById("buttonadd").innerHTML = gettranslate("buttonadd");
    document.getElementById("buttonremove").innerHTML = gettranslate("buttonremove");
    document.getElementById("addModalLabel").innerHTML = gettranslate("new_password");
    document.getElementById("nomeaddlabel").innerHTML = gettranslate("name");
    document.getElementById("senhaaddlabel").innerHTML = gettranslate("password");
    document.getElementById("usuarioaddlabel").innerHTML = gettranslate("username_label");
    document.getElementById("nomeadd").placeholder = gettranslate("ex_password_name");
    document.getElementById("senhaadd").placeholder = gettranslate("ex_note_desc");
    document.getElementById("usuarioadd").placeholder = gettranslate("ex_username");
    document.getElementById("canceladd").innerHTML = gettranslate("cancelbutton");
    document.getElementById("addadd").innerHTML = gettranslate("buttonadd");
    document.getElementById("excluirModalLabel").innerHTML = gettranslate("remove_passwords");
    document.getElementById("removedesc").innerHTML = gettranslate("remove_passwords_desc");
    document.getElementById("removecancel").innerHTML = gettranslate("cancelbutton");
    document.getElementById("removeremove").innerHTML = gettranslate("buttonremove");
    document.getElementById("editModalLabel").innerHTML = gettranslate("edit_password");
    document.getElementById("nomeeditlabel").innerHTML = gettranslate("name");
    document.getElementById("senhaeditlabel").innerHTML = gettranslate("password");
    document.getElementById("usuarioeditlabel").innerHTML = gettranslate("username_label");
    document.getElementById("nomeedit").placeholder = gettranslate("ex_password_name");
    document.getElementById("senhaedit").placeholder = gettranslate("ex_note_desc");
    document.getElementById("usuarioedit").placeholder = gettranslate("ex_username");
    document.getElementById("canceledit").innerHTML = gettranslate("cancelbutton");
    document.getElementById("saveedit").innerHTML = gettranslate("savebutton");
    document.getElementById("alertsmenu").innerHTML = gettranslate("alertsmenu");
    document.getElementById("usersmenu2").innerHTML = gettranslate("usersmenu2");
    document.getElementById("estatisticasmenu2").innerHTML = gettranslate("estatisticasmenu2");
    document.getElementById("sharetitle").innerHTML = gettranslate("share");
    document.getElementById("shareErrorModalLabel").innerHTML = gettranslate("warning");
    document.getElementById("shareErrordesc").innerHTML = gettranslate("warning_no_permission");
    document.getElementById("removesharetitle").innerHTML = gettranslate("remove");
    document.getElementById("cancelshare").innerHTML = gettranslate("cancelbutton");
    document.getElementById("saveshare").innerHTML = gettranslate("savebutton");
    document.getElementById("pixmenu").innerHTML = gettranslate("pixmenu");
    document.getElementById("uplabeladd").innerHTML = gettranslate("capital_letters");
    document.getElementById("uplabeledit").innerHTML = gettranslate("capital_letters");
    document.getElementById("downlabeladd").innerHTML = gettranslate("small_letters");
    document.getElementById("downlabeledit").innerHTML = gettranslate("small_letters");
    document.getElementById("numberslabeladd").innerHTML = gettranslate("numbers");
    document.getElementById("numberslabeledit").innerHTML = gettranslate("numbers");
    document.getElementById("characlabeladd").innerHTML = gettranslate("special_char");
    document.getElementById("characlabeledit").innerHTML = gettranslate("special_char");
    document.getElementById("lengthlabeladd").innerHTML = gettranslate("length");
    document.getElementById("lengthlabeledit").innerHTML = gettranslate("length");
    document.getElementById("descriptionaddlabel").innerHTML = gettranslate("description_label");
    document.getElementById("descriptionadd").placeholder = gettranslate("ex_note");
    document.getElementById("descriptioneditlabel").innerHTML = gettranslate("description_label");
    document.getElementById("descriptionedit").placeholder = gettranslate("ex_note");
    document.getElementById("vaultaddlabel").innerHTML = gettranslate("vault");
    document.getElementById("vaulteditlabel").innerHTML = gettranslate("vault");
}