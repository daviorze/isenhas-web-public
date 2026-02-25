
window.onload = function () {
    translate()
    loading.style.display = "none";
};
function login(){
    loading.style.display = "block";
    loginform.style.display = "none";
}
$("#recovery_btn_login").click(function(){
    authenticate()
});
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
function authenticate(){
    loading.style.display = "block";
    loginform.style.display = "none";
    var token = getCookie("tokenis");
    if (token == null || token == "") {
        window.location = 'login.html';
    }
    var xhr = new XMLHttpRequest();
    var url = host+"/iSenhasLoginRecoveryV4";
    if(development) url = host+"/iSenhasLoginRecoveryV4DEV";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.setRequestHeader('authorization', token);
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let input = document.getElementById("recovery_nomeedit");
          const d = new Date();
          var time = 12;
          d.setTime(d.getTime() + (time*60*60*1000));
          let expires = "expires="+ d.toUTCString();
          let recoveryEncrypted = await encryptData(input.value.toUpperCase())
          document.cookie = "recovery=" + recoveryEncrypted + ";" + expires + ";path=/;secure;SameSite=Strict";
          window.location = 'senhas.html';
        } else if (xhr.readyState === 4 && xhr.status === 406) {
            spinner.style.display = "none";
            recovery_loadinglabel.innerHTML = gettranslate("recovery_login_error")+": "+xhr.status;
        } else if(xhr.readyState === 4){
            spinner.style.display = "none";
            recovery_loadinglabel.innerHTML = gettranslate("login_error")+": "+xhr.status;
        }
    };
    let input = document.getElementById("recovery_nomeedit");
    sha256(input.value.toUpperCase()).then(function(resultado) {
        xhr.send("{\"recoverykey\":\""+resultado+"\"}")
    });    
}
function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  return crypto.subtle.digest("SHA-256", msgBuffer)
    .then(hashBuffer => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      return hashHex;
    });
}
function translate(){
        document.getElementById("recovery_title").innerHTML = gettranslate("recovery_title");
        document.getElementById("recovery_nomeeditlabel").innerHTML = gettranslate("recovery_key");
        document.getElementById("recovery_nomeedit").placeholder = gettranslate("recovery_nomeedit");
        document.getElementById("recovery_desc1").innerHTML = gettranslate("recovery_desc1");
        document.getElementById("recovery_desc2").innerHTML = gettranslate("login_desc2");
        document.getElementById("recovery_btn_login").innerHTML = gettranslate("btn_login");
        document.getElementById("recovery_loadinglabel").innerHTML = gettranslate("recovery_loadinglabel");
}