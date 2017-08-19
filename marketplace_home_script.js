document.addEventListener("DOMContentLoaded", updatePage);
document.addEventListener("DOMContentLoaded", showMarketArray);

function updatePage(){
    // Updates banner text and buttons on homepage.
    var bannerContent = window.sessionStorage.getItem("name");
    var loggedIn = window.sessionStorage.getItem("id");
    var isCustomer = window.sessionStorage.getItem("isCustomer");
    
    var homeBanner = document.getElementById("homeBanner");
    var bannerButton1 = document.getElementById("bannerButton1");
    var bannerButton2 = document.getElementById("bannerButton2");

    if(loggedIn > 0){
        if(bannerContent){
            homeBanner.textContent = "Welcome, " + bannerContent + ".";
        }
        if(isCustomer == "true"){
            bannerButton1.textContent = "Profile";
            bannerButton1.setAttribute("href", "customer_profile.html");
            bannerButton2.textContent = "Cart";
            bannerButton2.setAttribute("href", "customer_cart.html");
        } else{
            bannerButton1.textContent = "Profile";
            bannerButton1.setAttribute("href", "producer_profile.html");
            bannerButton2.textContent = "Inventory";
            bannerButton2.setAttribute("href", "index.html");
        }
    }
}

function showMarketArray(){
    // Shows marketplace items on homepage.
    var req = new XMLHttpRequest();
    var requestURL = "https://flip2.engr.oregonstate.edu:65512/productRange/";
    var params = {"startId": 1, "endId": 20};  // 1-100 are arbitrary. Should be changed for scalability.
     
    req.open("POST", requestURL, true);
    req.setRequestHeader("Content-Type", "application/json");
    
    req.addEventListener("load", function(){
        if(req.status >= 200 && req.status < 400){
            var json = JSON.parse(req.responseText);
            var marketplace = document.getElementById("marketplace");
            for(var item in json){
                for(var attribute in json[item]){
                    if(attribute != "product_id"){
                        var lineItem = document.createElement("p");
                        lineItem.textContent = "Item " + attribute + ": " + json[item][attribute];
                        marketplace.appendChild(lineItem);   
                    }
                }
                var addButton = document.createElement("div");
                function blah(){
                    addButton.setAttribute("class", "button add");
                    var productId = json[item]["product_id"];
                    addButton.textContent = "Add To Cart";

                    addButton.addEventListener("click", function(){bindAddToCartButton(productId)});
                }
                blah();
                marketplace.appendChild(addButton);
                
                var newLine = document.createElement("br");
                marketplace.appendChild(newLine);
            }
        } else{
            console.log("Error in network request: " + req.statusText);
        }
    });
    req.send(JSON.stringify(params));
    event.preventDefault();
}

function bindAddToCartButton(productId){
    var req = new XMLHttpRequest();
    var requestURL = "https://flip2.engr.oregonstate.edu:65512/cartAdd/";
    var customerId = window.sessionStorage.getItem("id");
    var params = {"customerId": customerId, "productId": productId, "quantity": 1};
    req.open("POST", requestURL, true);
    req.setRequestHeader("Content-Type", "application/json");
    
    req.addEventListener("load", function(){
        if(req.status >= 200 && req.status < 400){
            if(req.responseText == 'false'){
                alert("There was an error adding to the cart.");
            } else{
                window.open("index.html", "_self");
            }
        } else{
            console.log("Error in network request: " + req.statusText);
        }
    });
    req.send(JSON.stringify(params));
    event.preventDefault();
}
