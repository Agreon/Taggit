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

    // TODO: IF logout -> delete localStorage
    if(contains(window.location.href,"logout")){
        console.log("Logout");
        localStorage.removeItem("taggitToken");
    }
    else if(localStorage["taggitToken"]){
        window.location.href = "http://localhost:4200?token="+localStorage["taggitToken"].split(" ")[1];
    }
});

$("#loginBtn").click(function(){
    if(localStorage["taggitToken"]){
        window.location.href = appAddress+"?token="+localStorage["taggitToken"].split(" ")[1];
        return;
    }
    $("#loginModal").modal();
});


$("#registerBtn").click(function(){
    $("#registerModal").modal();
});

/**Form-Handling */
$("#loginSubmit").click(login);

$("#registerSubmit").click(register);

$("#loginModal").on("keyup",function(evt){
    // On Enter
    if(evt.keyCode == 13){
        login();
    }
});
$("#registerModal").on("keyup",function(evt){
    // On Enter
    if(evt.keyCode == 13){
        register();
    }
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
 console.log("Login");

    var name = $("#loginName").val();
    var pwd = $("#loginPassword").val();

   httpRequest("/authenticate", "post", {username: name, password: pwd}, function(res){
       if(!res.success){
           console.log("Err", res.msg);
           return;
       }
       console.log("Login", res.token.split(" "));

       if(!res.token){
           console.log("err",res);
           return;
       }
       $("#loginModal").hide();

        localStorage["taggitToken"] = res.token;
        var url = appAddress+"?token="+localStorage["taggitToken"].split(" ")[1];
        window.location.href = url;
   });
}

function register(){
    console.log("Register");

    var name = $("#registerName").val();
    var pwd = $("#registerPassword").val();

/**
 * TODO: If mode == 0 req: "authenticate" else req: "User"
 */

   httpRequest("/User", "post", {username: name, password: pwd}, function(res){
       if(!res.success){
           console.log("Err", res.msg);
           return;
       }
       console.log("Success register",res);
        localStorage["taggitToken"] = res.token;
        var url = appAddress+"?token="+localStorage["taggitToken"].split(" ")[1];
        window.location.href = url;
   });
}


function httpRequest(url, type, data, cb){
 $.ajax({
    url: serverAddress+url,
    type: type,
    data: data,
    error: function(err) {
        console.log("ERR", err);
    }
    }).done(cb);
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