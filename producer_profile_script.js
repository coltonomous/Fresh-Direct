var producer_id = window.sessionStorage.getItem("id");
var name = window.sessionStorage.getItem("name");
var email = window.sessionStorage.getItem("email");
var city = window.sessionStorage.getItem("city");
var state = window.sessionStorage.getItem("state");

document.addEventListener("DOMContentLoaded", fillInputBoxes);
document.addEventListener("DOMContentLoaded", bindProducerEditButton);
document.addEventListener("DOMContentLoaded", bindProducerLogoutButton);

function fillInputBoxes(){
    document.getElementById("producerEditName").value = name;
    document.getElementById("producerEditEmail").value = email;
    document.getElementById("producerEditCity").value = city;
    document.getElementById("producerEditState").value = state;
}    

function bindProducerEditButton(){
    document.getElementById("submitProducerEdit").addEventListener("click", function(event){
        
        var req = new XMLHttpRequest();
        var requestURL = "http://flip2.engr.oregonstate.edu:65512/producerEdit/";
        
        name = document.getElementById("producerEditName").value;
        email = document.getElementById("producerEditEmail").value;
        city = document.getElementById("producerEditCity").value;
        state = document.getElementById("producerEditState").value;
        var params = {"producer_id": producer_id, "company_name": name, "email": email, "city": city, "state": state};
        
        req.open("POST", requestURL, true);
        req.setRequestHeader("Content-Type", "application/json");
        
        req.addEventListener("load", function(){
            if(req.status >= 200 && req.status < 400){
                if(req.responseText == 'false'){
                    alert("Account edit failed. Make sure all information is submitted and is valid.");
                } else{                    
                    window.sessionStorage.setItem("name", name);
                    window.sessionStorage.setItem("email", email);
                    window.sessionStorage.setItem("city", city);
                    window.sessionStorage.setItem("state", state);
                    
                    fillInputBoxes();
                    window.open("index.html", "_self")
                }
            } else{
                console.log("Error in network request: " + req.statusText);
            }
        });
        req.send(JSON.stringify(params));
        event.preventDefault();
    });
}

function bindProducerLogoutButton(){
    document.getElementById("producerLogout").addEventListener("click", function(event){
        window.sessionStorage.setItem("id", 0);
        window.open("index.html", "_self");       
    });
}