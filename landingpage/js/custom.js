
var serverAddress = "http://localhost:3000";


/**
 * Redirect if set
 */
$( document ).ready(function() {
    console.log( "ready!" );
    console.log("localStorage",localStorage);
    if(localStorage["taggitToken"]){
        //window.location.href = "http://localhost:4200?token="+localStorage["taggitToken"].split(" ")[1];
    }
});

$("#loginBtn").click(function(){
    if(localStorage["taggitToken"]){
        window.location.href = "http://localhost:4200?token="+localStorage["taggitToken"].split(" ")[1];
        return;
    }
    $("#loginModal").modal();
});


$("#registerBtn").click(function(){
    $("#registerModal").modal();
});

/**
 * TODO: Read values and submit to taggit-server
 */
$("#loginSubmit").click(function(){
    console.log("Login");

    var name = $("#loginName").val();
    var pwd = $("#loginPassword").val();

   httpRequest("/authenticate", "post", {username: name, password: pwd}, function(res){
       if(!res.success){
           console.log("Err", res.msg);
           return;
       }
       console.log("Login", res.token.split(" "));

        localStorage["taggitToken"] = res.token;
        var url = "http://localhost:4200?token="+localStorage["taggitToken"].split(" ")[1];
        window.location.href = url;
   });
});

/**
 * TODO: Read values and submit to taggit-server
 */
$("#registerSubmit").click(function(){
    console.log("Register");

    var name = $("#registerName").val();
    var pwd = $("#registerPassword").val();

   httpRequest("/User", "post", {username: name, password: pwd}, function(res){
       if(!res.success){
           console.log("Err", res.msg);
           return;
       }
       console.log("Success register",res);
        localStorage["taggitToken"] = res.token;
        var url = "http://localhost:4200?token="+localStorage["taggitToken"].split(" ")[1];
        window.location.href = url;
   });
});

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