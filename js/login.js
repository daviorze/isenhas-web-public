var token = "";

window.onload = function () {
    translate()
    loading.style.display = "none";
    token = makeid();
    const qrcode = document.getElementById("qrcode");
    const qrdiv = document.getElementById("qrdiv");
    var QR_CODE = new QRCode("qrcode", {
        width: 260,
        height: 260,
        colorDark: "#090909",
        colorLight: "#FFFFFF",
        correctLevel: QRCode.CorrectLevel.H,
    });
    QR_CODE.clear();
    QR_CODE.makeCode(token);
    qrdiv.className = "qrdiv";
};
function makeid() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return btoa(String.fromCharCode(...bytes))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}
function login(){
    loading.style.display = "block";
    loginform.style.display = "none";
}
$("#btn_login").click(function(){
    authenticate(0)

});

function authenticate(count){
    loading.style.display = "block";
    loginform.style.display = "none";
    var xhr = new XMLHttpRequest();
    var url = host+"/iSenhasLoginV5";
    if(development) url = host+"/iSenhasLoginV5DEV";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.setRequestHeader('authorization', token);
    xhr.withCredentials = true;
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var objResponse = JSON.parse(xhr.responseText);
            let age = Date.now() / 1000 + 18000; // 30 minutos
            if (checkBox.checked === true) {
                age = Date.now() / 1000 + 604800; // 7dias
            }
            const expires = new Date(Date.now() + age).toUTCString();
            document.cookie = 
                "permission=" + encodeURIComponent(objResponse.permission) +
                ";expires=" + expires +
                ";path=/;SameSite=Lax;";
            await importAndStoreKey(objResponse.sha)
            if(objResponse.extremeprivacy != null){
                window.location = 'recoverykey.html';
            } else {
                window.location = 'senhas.html';
            }
        } else if (xhr.readyState === 4 && xhr.status === 201) {
            count++
            loadinglabel.innerHTML = gettranslate("login_loading")+ " ("+count+")";
            if(count < 21){
                setTimeout(() => {
                    authenticate(count)
                },3000);
            } else {
                spinner.style.display = "none";
                loadinglabel.innerHTML = gettranslate("login_error")+": "+xhr.status;
            }
        } else if(xhr.readyState === 4){
            console.log(xhr.responseText)
            spinner.style.display = "none";
            loadinglabel.innerHTML = gettranslate("login_error")+": "+xhr.status;
        }
    };
    var checkBox = document.getElementById("checkbox");
    let body = {
        checkbox: checkBox.checked
    }
    xhr.send(JSON.stringify(body));
}

function translate(){
        document.getElementById("title").innerHTML = gettranslate("login_title");
        document.getElementById("desc1").innerHTML = gettranslate("login_desc1");
        document.getElementById("desc2").innerHTML = gettranslate("login_desc2");
        document.getElementById("btn_login").innerHTML = gettranslate("btn_login");
        document.getElementById("loadinglabel").innerHTML = gettranslate("login_loading");
        document.getElementById("checkboxlabel").innerHTML =  gettranslate("login_checkbox");
}