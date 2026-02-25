var token = "";

window.onload = function () {
    translate()
    loading.style.display = "none";
    token = makeid(30);
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
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
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
    var url = host+"/iSenhasLoginV4";
    if(development) url = host+"/iSenhasLoginV4DEV";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.setRequestHeader('authorization', token);
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var objResponse = JSON.parse(xhr.responseText);
            const d = new Date();
            var checkBox = document.getElementById("checkbox");
            var time = 0.5;
            if(checkBox.checked == true)time = 12;
            d.setTime(d.getTime() + (time*60*60*1000));
            let expires = "expires="+ d.toUTCString();
            document.cookie = "tokenis=" + objResponse.token + ";" + expires + ";path=/;secure;SameSite=Strict";
            document.cookie = "permission=" + objResponse.permission + ";" + expires + ";path=/;secure;SameSite=Strict";
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
    xhr.send();
}

function translate(){
        document.getElementById("title").innerHTML = gettranslate("login_title");
        document.getElementById("desc1").innerHTML = gettranslate("login_desc1");
        document.getElementById("desc2").innerHTML = gettranslate("login_desc2");
        document.getElementById("btn_login").innerHTML = gettranslate("btn_login");
        document.getElementById("loadinglabel").innerHTML = gettranslate("login_loading");
        document.getElementById("checkboxlabel").innerHTML =  gettranslate("login_checkbox");
}