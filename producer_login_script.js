/*--------------------------------------------------------------------------------------------------------
producer Request Code
--------------------------------------------------------------------------------------------------------*/

document.addEventListener("DOMContentLoaded", bindProducerSignupButton);
document.addEventListener("DOMContentLoaded", bindProducerLoginButton);

function bindProducerSignupButton(){
    document.getElementById("submitProducerSignup").addEventListener("click", function(event){
        
        var req = new XMLHttpRequest();
        var requestURL = "https://flip2.engr.oregonstate.edu:65512/producerSignup/";
        var company_name = document.getElementById("producerSignupCompanyName").value; 
        var email = document.getElementById("producerSignupEmail").value; 
        var pword = document.getElementById("producerSignupPassword").value; 
        var city = document.getElementById("producerSignupCity").value; 
        var state = document.getElementById("producerSignupState").value;
        var params = {"company_name": company_name, "email": email, "password": pword, "city": city, "state": state};
        
        req.open("POST", requestURL, true);
        req.setRequestHeader("Content-Type", "application/json");
        
        req.addEventListener("load", function(){
            if(req.status >= 200 && req.status < 400){
                if(req.responseText == 'false'){
                    alert("Account creation failed. You are likely already in our database.");
                } else{
                    producerLogin(email, pword);
                }
            } else{
                console.log("Error in network request: " + req.statusText);
            }
        });
        req.send(JSON.stringify(params));
        event.preventDefault();
    });
}

function bindProducerLoginButton(){
    document.getElementById("submitProducerLogin").addEventListener("click", function(event){    
        var email = document.getElementById("producerLoginEmail").value; 
        var pword = document.getElementById("producerLoginPassword").value; 
        producerLogin(email, pword);
    });
}

function producerLogin(email, pword){
    var req = new XMLHttpRequest();
    var requestURL = "https://flip2.engr.oregonstate.edu:65512/producerLogin/";    
    var params = {"email": email, "password": pword};
        
    req.open("POST", requestURL, true);
    req.setRequestHeader("Content-Type", "application/json");
        
    req.addEventListener("load", function(){
        if(req.status >= 200 && req.status < 400){
            if(req.responseText == 'false'){
                console.log(req.responseText);
                alert("Account login failed. Please double check your email and password.");
            } else{
                var json = JSON.parse(req.responseText);
                window.sessionStorage.setItem("id", json[0]["producer_id"]);
                window.sessionStorage.setItem("name", json[0]["company_name"]);
                window.sessionStorage.setItem("email", json[0]["email"]);
                window.sessionStorage.setItem("city", json[0]["city"])
                window.sessionStorage.setItem("state", json[0]["state"])
                window.sessionStorage.setItem("isCustomer", "false");
                window.open("index.html",'_self');
            }
        } else{
            console.log("Error in network request: " + req.statusText);
        }
    });
    req.send(JSON.stringify(params));
    event.preventDefault();
}
