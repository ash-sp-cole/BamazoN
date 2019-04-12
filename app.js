var mysql = require("mysql");

var inquirer = require("inquirer");

 var itemWish = "";
 var itemQuantity = 0;
 
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"

});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as:" + connection.threadId);
    afterConnect();
});

function afterConnect() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log("\n ༼ つ ◕_◕ ༽つ ------ Welcome to BamazoN ------ ༼ つ ◕_◕ ༽つ\n")
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + "  |   " + "Stock Id : " + res[i].item_id + "  |  " + "Product name : " + res[i].product_name + "  |  " + "Department : " + res[i].department_name + "  |  " + "Current price : " + res[i].price + "  |  " + "Stock quantity : " + res[i].stock_quantity);

        }

        console.log("\n-------------------------------------------------------------\n");
        runSearch();



    });

};


function runSearch() {
    // prompt for item id number
    inquirer
        .prompt([{

            name: "item_id",
            type: "input",
            message: "Please state the Item Id you would like to look at: (Please insert # sign)  "

        }])


        .then(function (answer) {

            console.log("\n You have chosen item :" + answer.item_id);
            connection.query("SELECT * FROM products WHERE ?", { item_id: answer.item_id }, function (err, res) {
                if (err) throw err;
                console.log("\nStock Id : " + res[0].item_id + "  |  " + "Product name : " + res[0].product_name + "  |  " + "Department : " + res[0].department_name + "  |  " + "Current price : " + res[0].price + "  |  " + "Stock quantity : " + res[0].stock_quantity + "\n");
                 itemWish = answer.item_id;
                checkItem();
            });
        });

}


function checkItem(){
     // would you like to buy?
     inquirer
     .prompt([{
         
         // how many to buy
         name: "quantity",
         type: "input",
         message: "How many would you like to buy?"  

     }])
     .then(function (answer) {
     
             itemQuantity = answer.quantity

        
        confirmPurchase();
        
     }
    
     
     )};

function purchase (itemWish,itemQuantity) {

    connection.query('SELECT * FROM Products WHERE ?', { item_id: itemWish }, function(error, response) {
        if (error) { console.log(error) };

        if (itemQuantity <= response[0].stock_quantity) {
            totalCost = response[0].price * itemQuantity;
            console.log("\n \n \n The Total cost of this purchase is : $ " + totalCost);
       
          var newStock = (response[0].stock_quantity - itemQuantity);
         
          connection.query("UPDATE products SET ? WHERE ?", [{
            stock_quantity: newStock
        }, {
            item_id: itemWish
        }]),
          console.log("\n \n============================== ༼ つ ◕_◕ ༽つ ==== Thank you for your purchase ==== ༼ つ ◕_◕ ༽つ =================================");
          console.log("\n \n We now have : " + newStock + " item(s) in stock ===============================================  Tell your friends about this great deal !")
   buyAgain();
        }
    else {
        console.log("\n======================= Sorry we do not have enough item(s) in stock for this purchase, please check stock amount in directory ======================== \n \n")
     runSearch();
    }
})
};

function confirmPurchase() {
    inquirer
    .prompt([{
        
        // how many to buy
        name: "confirm",
        type: "confirm",
        message: "Would you like to purchase this item?"  

    }])

    .then(function (answer) {
        if (answer.confirm === true) {
            console.log("\n  \n");
            console.log( "-------  Grabbing your stuff off the shelf: -------- ");
           

            purchase(itemWish,itemQuantity);
        }
           
                 else {
                     console.log("\n Have another look at our Store\n")
                    
                     runSearch();
                 }
                }
    )};
    function buyAgain() {
        inquirer
        .prompt([{
            
            // how many to buy
            name: "confirm",
            type: "confirm",
            message: "Would you like to buy more items?"  
    
        }])
    
        .then(function (answer) {
            if (answer.confirm === true) {
                console.log("\n  \n");
                console.log( "-------  Loading the shop: -------- ");
               
    
                afterConnect();
            }
               
                     else {
                         console.log("\n Thank you for your purchase, please close the page when ready \n")
                        
                        
                     }
                    }
        )};
