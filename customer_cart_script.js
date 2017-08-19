document.addEventListener("DOMContentLoaded", showCustomerCart);
document.addEventListener("DOMContentLoaded", bindCustomerCheckoutButton);

function showCustomerCart(){
    var req = new XMLHttpRequest();
    var requestURL = "https://flip2.engr.oregonstate.edu:65512/cartView/";
    var customerId = window.sessionStorage.getItem("id");
    var params = {"customerId": customerId};
    
    req.open("POST", requestURL, true);
    req.setRequestHeader("Content-Type", "application/json");
    
    req.addEventListener("load", function(){
        if(req.status >= 200 && req.status < 400){
            if(req.responseText == 'false'){
                alert("There was an error retrieving you cart.");
            } else{
                var json = JSON.parse(req.responseText);
                var cart = document.getElementById("customerCart");
                var total = 0;
                for(var item in json){
                    for(var attribute in json[item]){
                        if(attribute != "product_id"){
                            var lineItem = document.createElement("li");
                            lineItem.textContent = "Item " + attribute + ": " + json[item][attribute];
                            cart.appendChild(lineItem);   
                        }
                        if(attribute == "price"){
                            total += (json[item][attribute] * json[item]["quantity"]);
                        }
                    }
                    var newLine = document.createElement("br");
                    cart.appendChild(newLine);
                }
                var cost = document.createElement("li");
                cost.textContent = "Total Price: $" + Math.round(total);
                cart.appendChild(cost);
            }
        } else{
            console.log("Error in network request: " + req.statusText);
        }
    });
    req.send(JSON.stringify(params));
    event.preventDefault();
}

function bindCustomerCheckoutButton(){
    document.getElementById("submitCustomerCheckout").addEventListener("click", function(event){
        
        var req = new XMLHttpRequest();
        var requestURL = "https://flip2.engr.oregonstate.edu:65512/cartCheckout/";
        var customerId = window.sessionStorage.getItem("id");
        var params = {"customerId": customerId};
        req.open("POST", requestURL, true);
        req.setRequestHeader("Content-Type", "application/json");
        
        req.addEventListener("load", function(){
            if(req.status >= 200 && req.status < 400){
                if(req.responseText == 'false'){
                    alert("There was an error during checkout.");
                } else{
                    var json = JSON.parse(req.responseText);
                    var supplyCheck = false;
                    for(var index in json){
                        for(var key in json[index]){
                            if(json[index][key] == "rowTablePrice"){
                                supplyCheck = true;
                            }   
                        }
                    }
                    if(supplyCheck){
                        alert("In at least some cases, your purchase quantity exceeds our supply. Please correct this and try again.");   
                    } else{
                        window.open("index.html", "_self");
                    }
                }
            } else{
                console.log("Error in network request: " + req.statusText);
            }
        });
        req.send(JSON.stringify(params));
        event.preventDefault();
    });
}

/*
If some products have a requested quantity greater than the amount in stock, then it returns a table containing the cart info and product info (quantity requested, number in stock, etc) for each respective product
	 so that the clientside can alert the customer to the problem. If the operation is successful, returns a table containing all checked out products info along with the (quantity * price) AS rowTotalPrice for each. Returns
	 an empty table if customer has no items in their cart.
Notes: Just look for whether rowTotalPrice is present in the returned table, if it isn't, then the table you are dealing with is the list of cart products with quantities higher than number in stock
*/
