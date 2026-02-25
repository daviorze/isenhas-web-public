var token = "";
var passwords;
var todasSenhas = [];
var numeroSenhas = 0;
var editSelected = 0;
var enviado = 0;
var selectedRows = [];
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
    getCompany()
    //form.style.display = "none";
};
function estatisticas(){
  window.location = 'estatisticas.html'
}
function getCompany() {
  todasSenhas = [];
  var token = getCookie("tokenis");
  if (token == null || token == "") {
    window.location = 'login.html';
  }
  loadinglabel.innerHTML = gettranslate("search_users")+"...";
  var xhr = new XMLHttpRequest();
  var url = host+"/iSenhasBuscarEmpresaV4";
  if(development) url = host+"/iSenhasBuscarEmpresaV4DEV";
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
          company_user = records;
          getUsers();
      }
    } else if (xhr.readyState === 4 && xhr.status === 401) {
      console.log(xhr.status);
      spinner.style.display = "none";
      window.location = 'login.html';
    }else if (xhr.readyState === 4) {
      console.log(xhr.status);
      spinner.style.display = "none";
      loadinglabel.innerHTML = gettranslate("search_users_error")+": " + xhr.status;
    }
  };

  xhr.send();
}
function getUsers() {
  todasSenhas = [];
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
        todasSenhas = records;
        loadinglabel.innerHTML = gettranslate("search_users")+": " + todasSenhas.length;
        reloadTable();
      }
    } else if (xhr.readyState === 4 && xhr.status === 401) {
      console.log(xhr.status);
      spinner.style.display = "none";
      window.location = 'login.html';
    }else if (xhr.readyState === 4) {
      console.log(xhr.status);
      spinner.style.display = "none";
      loadinglabel.innerHTML = gettranslate("search_users_error")+": " + xhr.status;
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
function reloadTable(){
    $('#table-body').empty();
    selectedRows = [];
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
      for(var ele in tr){
        var t = tr[ele]
        t.className = "rows"
      }
      td.className = "selected"
      var recordName = tr[id].getElementsByTagName("td")[3].innerHTML;
      var recordChangeTag = tr[id].getElementsByTagName("td")[4].innerHTML;
      var email = tr[id].getElementsByTagName("td")[0].innerHTML;
      selectedRows = [];
      selectedRows.push({"originalIndex":id,"element":{"recordName":recordName,"recordChangeTag":recordChangeTag,"email":email}})
    }
    console.log(selectedRows)
  }
}
function transfer()
{
  if (document.getElementById('checkbox').checked) 
  {
    $('#usertransfer').prop('disabled', false);
    $('.selectpicker').selectpicker('refresh');
  } else {
    $("#usertransfer").prop("disabled", true);
    $(".selectpicker[id='usertransfer']").selectpicker('refresh');
  }
}
function add(){
  var modal = $("#addModal")
    modal.find('#emailadd').val("")
    modal.find('#permissionadd').val("")
  $("#addModal").modal();
}
function pix(){
  window.location = "pix.html";
}
function buttonadicionar(){
  var modal = $("#addModal")
  if(modal.find('#emailadd').val().length == 0)
    return;
  modal.modal("hide")
  loading.style.display = "block";
  limiter.style.display = "none";
  addSenha();
}
function addSenha() {
  var token = getCookie("tokenis");
  if (token == null || token == "") {
    window.location = 'login.html';
  }
  loadinglabel.innerHTML = gettranslate("add_user")+"...";
  var xhr = new XMLHttpRequest();
  var url = host+"/iSenhasAddUsuariosV4";
  if(development) url = host+"/iSenhasAddUsuariosV4DEV";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('authorization', token);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      limiter.style.display = "none";
      loading.style.display = "block";
      getUsers();
    } else if (xhr.readyState === 4 && xhr.status === 205) {
      spinner.style.display = "none";
      var language = navigator.language || navigator.userLanguage;
      loadinglabel.innerHTML = gettranslate("add_user_limit")+": " + xhr.status;
    }else if (xhr.readyState === 4 && xhr.status === 504) {
      spinner.style.display = "none";
      var language = navigator.language || navigator.userLanguage;
      loadinglabel.innerHTML = gettranslate("add_user_already_exists")+": " + xhr.status;
    }else if (xhr.readyState === 4) {
      spinner.style.display = "none";
      var language = navigator.language || navigator.userLanguage;
      loadinglabel.innerHTML = gettranslate("add_user_error")+": " + xhr.status;
    }
  };
  var modal = $("#addModal")
  var perfil = document.getElementById("permissionadd");
  var per = "USER";
  if(perfil.selectedIndex != -1)
    per = perfil.options[perfil.selectedIndex].value;
  var query = { "element":{"email":modal.find('#emailadd').val(),"permission":per}};
  xhr.send( ""+JSON.stringify(query) );
}
function excluir(){
  var removed = "";
  if(selectedRows.length!=0){
    var element = selectedRows[0].element;
    removed = element.email;
  } 
  var d = document.getElementById("usertransfer");
  removeAll(d);
  todasSenhas.forEach(element => {
    
    var option = document.createElement("option");
    option.text = element.email;
    if(removed != element.email)
      d.add(option);
  });


  $("#excluirModal").modal();
}
function removeAll(selectBox) {
  while (selectBox.options.length > 0) {
      selectBox.remove(0);
  }
}
function buttonremove(){
  loading.style.display = "block";
  limiter.style.display = "none";
  if(selectedRows.length==0){
    loadinglabel.innerHTML = gettranslate("no_user_selected");
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
  loadinglabel.innerHTML = gettranslate("remove_user")+"...";
  var xhr = new XMLHttpRequest();
  var url = host+"/iSenhasExcluirUsuariosV4";
  if(development) url = host+"/iSenhasExcluirUsuariosV4DEV";
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
        getUsers();
      }
    } else if (xhr.readyState === 4) {
      console.log(xhr.status);
      spinner.style.display = "none";
      loadinglabel.innerHTML = gettranslate("remove_user_error")+": " + xhr.status;
    }
  };
  var operations = [];
  var forvalue = 200;
  if(selectedRows.length<200)forvalue = selectedRows.length;  
  for(var z=0;z<forvalue;z++) {
    var element = selectedRows[z].element;
    var operation = {"record":{"recordName":element.recordName,"recordChangeTag":element.recordChangeTag,"recordType":"premium"},"operationType":"delete"};
    operations.push(operation)
  }
  var executor = document.getElementById("usertransfer");
  var usertransfer = executor.options[executor.selectedIndex].text;
  var query = { "operations":operations };
  if (document.getElementById('checkbox').checked) 
  {
    xhr.send("{\"query\" : " + JSON.stringify(query) + ",\"transfer\":\""+usertransfer+"\"}");
  } else {
    xhr.send("{\"query\" : " + JSON.stringify(query) + "}");
  }
}
function edit(id){
  var modal = $("#editarModal")
    modal.find('#emailedit').val(todasSenhas[id-1].email)
    console.log(todasSenhas[id-1].permission)
    $('select[name=permissionedit]').val(todasSenhas[id-1].permission);
    $('#permissionedit').selectpicker('refresh')
    editSelected = id;
  $("#editarModal").modal();
}
function buttoneditar(){
  var modal = $("#editarModal")
  if(modal.find('#emailedit').val().length == 0)
    return;
  modal.modal("hide")
  loading.style.display = "block";
  loadinglabel.style.display = "block";
  limiter.style.display = "none";
  editSenha();
}
function editSenha() {
  var token = getCookie("tokenis");
  if (token == null || token == "") {
    window.location = 'login.html';
  }
  loadinglabel.innerHTML = gettranslate("update_user")+"...";
  var xhr = new XMLHttpRequest();
  var url = host+"/iSenhasAtualizarUsuarioV4";
  if(development) url = host+"/iSenhasAtualizarUsuarioV4DEV";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('authorization', token);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      limiter.style.display = "none";
      loading.style.display = "block";
      getUsers()
    } else if (xhr.readyState === 4) {
      console.log(xhr.status);
      spinner.style.display = "none";
      var language = navigator.language || navigator.userLanguage;
      loadinglabel.innerHTML = gettranslate("update_user_error")+": " + xhr.status;
    }
  };
  var modal = $("#editarModal")
  var operations = [];
  var operation = {"record":{"recordName":todasSenhas[editSelected-1].recordName,"recordChangeTag":todasSenhas[editSelected-1].recordChangeTag,"recordType":"premium",
  "fields":{
  "email":{"value":modal.find('#emailedit').val()},
  "companyprofile":{"value":modal.find('#permissionedit').val()}
  
  }},"operationType":"update"};
  operations.push(operation)
  var query = { "operations":operations };
  xhr.send("{\"query\" : " + JSON.stringify(query) + "}");
}
function gerarsenha(){
  var newPass = Password.generate(18);
  console.log(newPass)
  var modal = $("#addModal")
  modal.find('#senhaadd').val(newPass)
  var modaledit = $("#editarModal")
  modaledit.find('#senhaedit').val(newPass)
  updateInput(newPass)
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
    document.getElementById("loadinglabel").innerHTML = gettranslate("search_users")+"...";
    document.getElementById("nametitle").innerHTML = gettranslate("email");
    document.getElementById("observationtitle").innerHTML = gettranslate("permission");
    document.getElementById("docsmenu").innerHTML = gettranslate("docsmenu");
    document.getElementById("search").placeholder = gettranslate("search_user");
    document.getElementById("page").placeholder = gettranslate("login_title");
    document.getElementById("edittitle").innerHTML = gettranslate("edit");
    document.getElementById("passwordsmenu").innerHTML = gettranslate("passwordsmenu");
    document.getElementById("notesmenu").innerHTML = gettranslate("notesmenu");
    document.getElementById("logoutmenu").innerHTML = gettranslate("logoutmenu");
    document.getElementById("title").innerHTML = gettranslate("users");
    document.getElementById("buttonadd").innerHTML = gettranslate("buttonadd");
    document.getElementById("buttonremove").innerHTML = gettranslate("buttonremove");
    document.getElementById("addModalLabel").innerHTML = gettranslate("new_user");
    document.getElementById("emailaddlabel").innerHTML = gettranslate("email")
    document.getElementById("permissionaddlabel").innerHTML = gettranslate("permission")
    document.getElementById("emailadd").placeholder = gettranslate("ex_username");
    document.getElementById("permissionadd").placeholder = gettranslate("ex_permission");
    document.getElementById("canceladd").innerHTML = gettranslate("cancelbutton");
    document.getElementById("addadd").innerHTML = gettranslate("buttonadd");
    document.getElementById("excluirModalLabel").innerHTML = gettranslate("remove_users");
    document.getElementById("removedesc").innerHTML = gettranslate("remove_users_desc");
    document.getElementById("removecancel").innerHTML = gettranslate("cancelbutton");
    document.getElementById("removeremove").innerHTML = gettranslate("buttonremove");
    document.getElementById("editModalLabel").innerHTML = gettranslate("edit_user");
    document.getElementById("emaileditlabel").innerHTML = gettranslate("email")
    document.getElementById("permissioneditlabel").innerHTML = gettranslate("permission");
    document.getElementById("emailedit").placeholder = gettranslate("ex_username");
    document.getElementById("permissionedit").placeholder = gettranslate("ex_permission");
    document.getElementById("canceledit").innerHTML = gettranslate("cancelbutton");
    document.getElementById("saveedit").innerHTML = gettranslate("savebutton");
    document.getElementById("alertsmenu").innerHTML = gettranslate("alertsmenu");
    document.getElementById("usersmenu2").innerHTML = gettranslate("usersmenu2");
    document.getElementById("estatisticasmenu2").innerHTML = gettranslate("estatisticasmenu2");
    document.getElementById("pixmenu").innerHTML = gettranslate("pixmenu");

  
}