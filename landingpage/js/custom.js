var loginMode = 0;
var serverAddress = "http://localhost:3000";
//var serverAddress = "https://agreon.de:3001";
var appAddress = "http://localhost:4200";
//var appAddress = "https://agreon.de:444";

/**
 * Redirect if set
 */
$( document ).ready(function() {
    console.log( "ready!" );
    console.log("localStorage",localStorage);

    // IF logout -> delete localStorage
    if(contains(window.location.href,"logout")){
        console.log("Logout");
        localStorage.removeItem("taggitToken");
    }
    else if(localStorage["taggitToken"]){
       // TODO: Not until logout works
       // window.location.href = "http://localhost:4200?token="+localStorage["taggitToken"].split(" ")[1];
    }
});

$("#loginBtn").click(function(){
    if(localStorage["taggitToken"]){
        window.location.href = appAddress+"?token="+localStorage["taggitToken"].split(" ")[1];
        return;
    }
    $("#loginModal").modal();
    $("#loginInfo").hide();
    $("#loginName").focus();
});


/**Form-Handling */
$("#loginSubmit").click(login);


$("#loginModal").on("keyup",function(evt){
    // On Enter
    if(evt.keyCode == 13){
        login();
    }
});

$("#switchRegister").click(function(){
    if(loginMode == 0){
        loginMode = 1;
        $("#switchRegister").text("Already got an Account? Login!");
        $("#modal-title").text("Register");
        $("#emailField").show();
    }else {
        loginMode = 0;
        $("#switchRegister").text("Don't got an Account yet? Register!");
        $("#modal-title").text("Login");
        $("#emailField").hide();
    }    
    $("#loginInfo").hide();
});

/**
 * Scrolling
 */
$(".toServices").click(function(evt){
    evt.preventDefault();
    scrollTo("services");
})


/**
 * Methods
 */

function login(){
    var name = $("#loginName").val();
    var pwd = $("#loginPassword").val();
    var keepCredenitals = $("#keepCredentials")[0].checked;

    var sendObj = {
        username: name,
        password: pwd
    };

    var request = "/authenticate";

    // If Register-mode add email and change request
    if(loginMode == 1){
        var email = $("#email").val();
        sendObj.email = email;
        request = "/User";
    }

   httpRequest(request, "post", sendObj, function(res){
       if(!res.success){
           console.log("Err", res);
           setLoginError(res.msg);
           return;
       }
       console.log("Login", res.token.split(" "));

       if(!res.token){
           console.log("err",res);
           setLoginError(res.msg);
           return;
       }
       $("#loginModal").hide();

        if(keepCredenitals){
            localStorage["taggitToken"] = res.token;
        }

        var url = appAddress+"?token="+res.token.split(" ")[1];
        window.location.href = url;
   });
}

function httpRequest(url, type, data, cb){
 $.ajax({
    url: serverAddress+url,
    type: type,
    data: data,
    error: function(err) {
       setLoginError("Sorry, we got an Servererror"); 
        console.log("ERR", err);
    }
    }).done(cb);
}

function setLoginError(err){
    $("#loginInfo").html("<i class='fa fa-exclamation-triangle'></i>&nbsp;"+err);
    $("#loginInfo").show();
}

function scrollTo(id){
    $('html,body').animate({
        scrollTop: $("#"+id).offset().top},
        'slow');
}

function contains(str, search){
    for(var i = 0; i < str.length - search.length; i++){
        var found = true;
        for(var j = 0; j < search.length; j++){
            if(str[i] != search[i+j]){
                found = false;
                break;
            }
        }
        if(found){
            return true;
        }
    }

    return false;
}