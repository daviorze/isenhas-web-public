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
var vaults = []
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
};
function estatisticas(){
  window.location = 'estatisticas.html'
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
  loadinglabel.innerHTML = gettranslate("search_pix")+"...";
  var xhr = new XMLHttpRequest();
  var url = host+"/iSenhasBuscarPixV4";
  if(development) url = host+"/iSenhasBuscarPixV4DEV";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('authorization', token);

  xhr.onreadystatechange = async function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var objResponse = JSON.parse(xhr.responseText);
      var records = objResponse.passwords;
      if (records.length == 0) {
        var permission = getCookie("permission");
        if(permission == "ADMIN" || permission == "USER"){
          getUsers();
        } else {
          getVaults()
        }
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
        }));
        todasSenhas = records;
        loadinglabel.innerHTML = gettranslate("search_pix")+": " + todasSenhas.length;
        var permission = getCookie("permission");
        if(permission == "ADMIN" || permission == "USER"){
          getUsers();
        } else {
          getVaults()
        }
      }
    } else if (xhr.readyState === 4 && xhr.status === 401) {
      spinner.style.display = "none";
      window.location = 'login.html';
    }else if (xhr.readyState === 4) {
      spinner.style.display = "none";
      loadinglabel.innerHTML = gettranslate("search_pix_error")+": " + xhr.status;
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

  xhr.send(""+JSON.stringify({"type":"pix"}));
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
function reloadTable(){
    $('#table-body').empty();
    selectedRows = [];
    document.getElementById("title").innerHTML =gettranslate("pixs") +" ("+todasSenhas.length+") ";
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
        var type = "-";
        if(password.fields.observation !=null)observation = password.fields.observation.value;
        if(observation.length == 0)observation = "-"
        if(password.fields.type !=null)type = password.fields.type.value;
        var pass = password.fields.password.value
        var image = "pix";
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
                  <td class= "info" id="pass" onclick="select(${i+1})"><input id="password" class="passwordRow" type="password" value="${pass}" readonly/></td>
                  <td class= "info" style="text-align:left;">
                      <i class="far fa-eye-slash" onClick= "showHide(${i+1})"></i>
                  </td> 
                  <td class= "info" style="text-align:left;"> 
                  <i class="far fa-copy" onClick= "copy(${i+1})"></i>
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
              <td class= "info" id="pass" onclick="select(${i+1})"><input id="password" class="passwordRow" type="password" value="${pass}" readonly/></td>
            <td class= "info" style="text-align:left;">
                <i class="far fa-eye-slash" onClick= "showHide(${i+1})"></i>
            </td> 
            <td class= "info" style="text-align:left;"> 
            <i class="far fa-copy" onClick= "copy(${i+1})"></i>
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
          }
      }
    } else {
      //document.getElementById("sharetitle").style.display = "none";
      for(var i=0;i<todasSenhas.length;i++){
        var password = todasSenhas[i];
        var named = password.fields.name.value;
        var observation = "-";
        var type = "-";
        var display_star = "none"
        if(password.fields.favorite !=null)display_star = "block"
        if(password.fields.observation !=null)observation = password.fields.observation.value;
        if(observation.length == 0)observation = "-"
        if(password.fields.type !=null)type = password.fields.type.value;
        var pass = password.fields.password.value
        var image = "pix"
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
                    <td class= "info" id="pass" onclick="select(${i+1})"><input id="password" class="passwordRow" type="password" value="${pass}" readonly/></td>
                  <td class= "info" style="text-align:left;">
                      <i class="far fa-eye-slash" onClick= "showHide(${i+1})"></i>
                  </td> 
                  <td class= "info" style="text-align:left;"> 
                  <i class="far fa-copy" onClick= "copy(${i+1})"></i>
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
              <td class= "info" id="pass" onclick="select(${i+1})"><input id="password" class="passwordRow" type="password" value="${pass}" readonly/></td>
            <td class= "info" style="text-align:left;">
                <i class="far fa-eye-slash" onClick= "showHide(${i+1})"></i>
            </td> 
            <td class= "info" style="text-align:left;"> 
            <i class="far fa-copy" onClick= "copy(${i+1})"></i>
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
          }
      }
    }

    refreshOptionsVault();
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
      var recordName = tr[id].getElementsByTagName("td")[6].innerHTML;
      var recordChangeTag = tr[id].getElementsByTagName("td")[7].innerHTML;
      if(document.getElementById("passdesc"+id)) selectedRows.push({"originalIndex":id,"element":{"recordName":recordName,"recordChangeTag":recordChangeTag,"sharedDesc":document.getElementById("passdesc"+id).innerHTML}})
      else selectedRows.push({"originalIndex":id,"element":{"recordName":recordName,"recordChangeTag":recordChangeTag}})
    }
  }
}
function add(){
  var modal = $("#addModal")
    modal.find('#nomeadd').val("")
    modal.find('#senhaadd').val("")
    modal.find('#usuarioadd').val("")
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
  loadinglabel.innerHTML = gettranslate("add_pix")+"...";
  var xhr = new XMLHttpRequest();
  var url = host+"/iSenhasAddPixV4";
  if(development) url = host+"/iSenhasAddPixV4DEV";
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
      var language = navigator.language || navigator.userLanguage;
      loadinglabel.innerHTML = gettranslate("add_pix_error")+": " + xhr.status;
    }
  };
  var modal = $("#addModal")
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
      password: myPassword,
    },
  };  
  var executor = document.getElementById("vaultaddoptions");
  if(executor.selectedIndex != 0){
    var vaultid = vaults[executor.selectedIndex].recordName;
    query.element.vaultid = vaultid
  }
  xhr.send( ""+JSON.stringify(query) );
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
  loadinglabel.innerHTML = gettranslate("update_pix")+"...";
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
      loadinglabel.innerHTML = gettranslate("update_pix_error")+": " + xhr.status;
    }
  };
  var favorite = todasSenhas[selectedUser-1].fields.favorite
  var enc = [];
  passwordPermissions.forEach(element => {
    enc.push(element);
  });
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
  loadinglabel.innerHTML = gettranslate("remove_pixs")+": "+enviado;
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
      loadinglabel.innerHTML = gettranslate("remove_pixs_error")+": " + xhr.status;
    }
  };
  var operations = [];
  var forvalue = 200;
  if(selectedRows.length<200)forvalue = selectedRows.length;  
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
    var modal = $("#editarModal")
    var observation = "";
    if(todasSenhas[id-1].fields.observation != undefined)observation = todasSenhas[id-1].fields.observation.value
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
    let translator = gettranslate("favorite_pix")
    if(password.sharedDesc == null){
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
  loadinglabel.innerHTML = gettranslate("update_pix")+"...";
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
      var language = navigator.language || navigator.userLanguage;
      loadinglabel.innerHTML = gettranslate("update_pix_error")+": " + xhr.status;
    }
  };
  var favorite = document.getElementById("favoriteedit")
  var modal = $("#editarModal")
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
  if(observation.length!=0){
    if(isExtreme){
      observation = await encryptExtreme(observation)
    }
  }
    
  if(modal.find('#senhaedit').val() == oldPassword) oldPassword = "";
  var operations = [];
  var operation = {"record":{"recordName":todasSenhas[editSelected-1].recordName,"recordChangeTag":todasSenhas[editSelected-1].recordChangeTag,"recordType":"passwords",
  "fields":{
  "name":{"value":myName},
  "password":{"value":myPassword},
  "observation":{"value":observation}
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
  var executor = document.getElementById("vaulteditoptions");
  if(executor.selectedIndex != 0){
    var vaultid = vaults[executor.selectedIndex].recordName;
    operation.record.fields.vaultid = {"value":vaultid}
    operation.record.fields.vault = {"value":vaultid}
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
    document.getElementById("loadinglabel").innerHTML = gettranslate("search_pix")+"...";
    document.getElementById("nametitle").innerHTML = gettranslate("name");
    document.getElementById("observationtitle").innerHTML = gettranslate("description");
    document.getElementById("passwordtitle").innerHTML = gettranslate("pix");
    document.getElementById("showtitle").innerHTML = gettranslate("show");
    document.getElementById("copytitle").innerHTML = gettranslate("copy");
    document.getElementById("search").placeholder = gettranslate("search_pix_s");
    document.getElementById("page").placeholder = gettranslate("login_title");
    document.getElementById("edittitle").innerHTML = gettranslate("edit");
    document.getElementById("passwordsmenu").innerHTML = gettranslate("passwordsmenu");
    document.getElementById("notesmenu").innerHTML = gettranslate("notesmenu");
    document.getElementById("logoutmenu").innerHTML = gettranslate("logoutmenu");
    document.getElementById("title").innerHTML = gettranslate("pixs");
    document.getElementById("buttonadd").innerHTML = gettranslate("buttonadd");
    document.getElementById("buttonremove").innerHTML = gettranslate("buttonremove");
    document.getElementById("addModalLabel").innerHTML = gettranslate("new_pix");
    document.getElementById("nomeaddlabel").innerHTML = gettranslate("name");
    document.getElementById("senhaaddlabel").innerHTML = gettranslate("pix");
    document.getElementById("usuarioaddlabel").innerHTML = gettranslate("description_optional");
    document.getElementById("nomeadd").placeholder = gettranslate("ex_pix_name");
    document.getElementById("senhaadd").placeholder = gettranslate("ex_pix_desc");
    document.getElementById("usuarioadd").placeholder = gettranslate("ex_description");
    document.getElementById("canceladd").innerHTML = gettranslate("cancelbutton");
    document.getElementById("addadd").innerHTML = gettranslate("buttonadd");
    document.getElementById("excluirModalLabel").innerHTML = gettranslate("remove_pix");
    document.getElementById("removedesc").innerHTML = gettranslate("remove_pix_desc");
    document.getElementById("removecancel").innerHTML = gettranslate("cancelbutton");
    document.getElementById("removeremove").innerHTML = gettranslate("buttonremove");
    document.getElementById("editModalLabel").innerHTML = gettranslate("edit_pix");
    document.getElementById("nomeeditlabel").innerHTML = gettranslate("name");
    document.getElementById("senhaeditlabel").innerHTML = gettranslate("pix");
    document.getElementById("usuarioeditlabel").innerHTML = gettranslate("description_optional");
    document.getElementById("nomeedit").placeholder = gettranslate("ex_pix_name");
    document.getElementById("senhaedit").placeholder = gettranslate("ex_pix_desc");
    document.getElementById("docsmenu").innerHTML = gettranslate("docsmenu");
    document.getElementById("usuarioedit").placeholder = gettranslate("ex_description");
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
    document.getElementById("vaultaddlabel").innerHTML = gettranslate("vault");
    document.getElementById("vaulteditlabel").innerHTML = gettranslate("vault");
}