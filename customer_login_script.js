/*--------------------------------------------------------------------------------------------------------
Customer Request Code
--------------------------------------------------------------------------------------------------------*/

document.addEventListener("DOMContentLoaded", bindCustomerSignupButton);
document.addEventListener("DOMContentLoaded", bindCustomerLoginButton);

function bindCustomerSignupButton(){
    document.getElementById("submitCustomerSignup").addEventListener("click", function(event){
        
        var req = new XMLHttpRequest();
        var requestURL = "https://flip2.engr.oregonstate.edu:65512/customerSignup/";
        var fname = document.getElementById("customerSignupFName").value; 
        var lname = document.getElementById("customerSignupLName").value; 
        var email = document.getElementById("customerSignupEmail").value; 
        var pword = document.getElementById("customerSignupPassword").value; 
        var city = document.getElementById("customerSignupCity").value; 
        var state = document.getElementById("customerSignupState").value;
        var params = {"fname": fname, "lname": lname, "email": email, "password": pword, "city": city, "state": state};
        
        req.open("POST", requestURL, true);
        req.setRequestHeader("Content-Type", "application/json");
        
        req.addEventListener("load", function(){
            if(req.status >= 200 && req.status < 400){
                if(req.responseText =='false'){
                    alert("Account creation failed. You are likely already in our database.");
                } else{
                    customerLogin(email, pword);
                }
            } else{
                console.log("Error in network request: " + req.statusText);
            }
        });
        req.send(JSON.stringify(params));
        event.preventDefault();
    });
}

function bindCustomerLoginButton(){
    document.getElementById("submitCustomerLogin").addEventListener("click", function(event){
        var email = document.getElementById("customerLoginEmail").value; 
        var pword = document.getElementById("customerLoginPassword").value; 
        customerLogin(email, pword);
    });
}

function customerLogin(email, pword){
    var req = new XMLHttpRequest();
    var requestURL = "https://flip2.engr.oregonstate.edu:65512/customerLogin/";    
    var params = {"email": email, "password": pword};
        
    req.open("POST", requestURL, true);
    req.setRequestHeader("Content-Type", "application/json");
        
    req.addEventListener("load", function(){
        if(req.status >= 200 && req.status < 400){
            if(req.responseText == 'false'){
                alert("Account login failed. Please double check your email and password.");
            } else{
                var json = JSON.parse(req.responseText);
                window.sessionStorage.setItem("id", json[0]["customer_id"]);
                window.sessionStorage.setItem("name", json[0]["fname"]);
                window.sessionStorage.setItem("lname", json[0]["lname"]);
                window.sessionStorage.setItem("email", json[0]["email"]);
                window.sessionStorage.setItem("city", json[0]["city"])
                window.sessionStorage.setItem("state", json[0]["state"])
                window.sessionStorage.setItem("isCustomer", "true");
                window.open("index.html",'_self');
            }
        } else{
            console.log("Error in network request: " + req.statusText);
        }
    });
    req.send(JSON.stringify(params));
    event.preventDefault();
}
