var customer_id = window.sessionStorage.getItem("id");
var name = window.sessionStorage.getItem("name");
var lname = window.sessionStorage.getItem("lname");
var email = window.sessionStorage.getItem("email");
var city = window.sessionStorage.getItem("city");
var state = window.sessionStorage.getItem("state");

document.addEventListener("DOMContentLoaded", fillInputBoxes);
document.addEventListener("DOMContentLoaded", bindCustomerEditButton);
document.addEventListener("DOMContentLoaded", bindCustomerLogoutButton);

function fillInputBoxes(){
    document.getElementById("customerEditFName").value = name;
    document.getElementById("customerEditLName").value = lname;
    document.getElementById("customerEditEmail").value = email;
    document.getElementById("customerEditCity").value = city;
    document.getElementById("customerEditState").value = state;
} 

function bindCustomerEditButton(){
    document.getElementById("submitCustomerEdit").addEventListener("click", function(event){
        
        var req = new XMLHttpRequest();
        var requestURL = "http://flip2.engr.oregonstate.edu:65512/customerEdit/";
        
        name = document.getElementById("customerEditFName").value;
        lname = document.getElementById("customerEditLName").value;
        email = document.getElementById("customerEditEmail").value;
        city = document.getElementById("customerEditCity").value;
        state = document.getElementById("customerEditState").value;         
        var params = {"customer_id": customer_id, "fname": name, "lname": lname, "email": email, "city": city, "state": state};
        
        req.open("POST", requestURL, true);
        req.setRequestHeader("Content-Type", "application/json");
        
        req.addEventListener("load", function(){
            if(req.status >= 200 && req.status < 400){
                if(req.responseText == 'false'){
                    alert("Account edit failed. Make sure all information is submitted and is valid.");
                } else{                    
                    window.sessionStorage.setItem("name", name);
                    window.sessionStorage.setItem("lname", lname);
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

function bindCustomerLogoutButton(){
    document.getElementById("customerLogout").addEventListener("click", function(event){
        window.sessionStorage.setItem("id", 0);
        window.open("index.html", "_self");       
    });
}