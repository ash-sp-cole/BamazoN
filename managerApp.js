var mysql = require("mysql");

var inquirer = require("inquirer");


 
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
   searchManager();
});

function runInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log("\n ༼ つ ◕_◕ ༽つ ------ Welcome to BamazoN ------ ༼ つ ◕_◕ ༽つ\n")
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + "  |   " + "Stock Id : " + res[i].item_id + "  |  " + "Product name : " + res[i].product_name + "  |  " + "Department : " + res[i].department_name + "  |  " + "Current price : " + res[i].price + "  |  " + "Stock quantity : " + res[i].stock_quantity);

        }

        console.log("\n-------------------------------------------------------------\n");
      searchManager();



    });

};

function searchManager() {
    // prompt for item id number
    inquirer
    .prompt({
        name: "choice",
        type: "list",
        message: "What would you like to do Mr.Manager ?\n",
        choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product"]
      })
  


        .then(function (answer) {
            console.log("\n ================ You have chosen:  " + answer.choice + "    ===================== \n");
          if(answer.choice === "View Products") {
              runInventory();
          }
          else if ( answer.choice === "View Low Inventory") {
              viewLowInventory();
          }
          else if (answer.choice === "Add to Inventory") {
             addToInventory();
          }
          else if(answer.choice === "Add New Product") {
              addNewProduct();
          }
        });

}

function viewLowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
        
        if (res[i].stock_quantity <= 5) {
            console.log("\n========================  5 or less in stock ========================\n")
            console.log(res[i].id + "  |   " + "Stock Id : " + res[i].item_id + "  |  " + "Product name : " + res[i].product_name + "  |  " + "Department : " + res[i].department_name + "  |  " + "Current price : " + res[i].price + "  |  " + "Stock quantity : " + res[i].stock_quantity);


        }
      
    }
    console.log("\n" + "\n")
    searchManager();
    });
  
}

function addToInventory() {

    inquirer
    .prompt([{

        name: "item_id",
        type: "input",
        message: "Please type the item ID number of the item you would like to increase ( Remember to include the # sign) "

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
        message: "How many would you like to add to our stock?"  

    }])
    .then(function (answer) {
    
            itemQuantity = answer.quantity

       
            purchase(itemWish,itemQuantity);
       
    }
   
    
    )};
    function purchase (itemWish,itemQuantity) {

        connection.query('SELECT * FROM Products WHERE ?', { item_id: itemWish }, function(error, response) {
            if (error) { console.log(error) };
    
          
           
              var newStock = (response[0].stock_quantity + parseInt(itemQuantity));
             
              connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: newStock
            }, {
                item_id: itemWish
            }]),
              console.log("\n \n============================== ༼ つ ◕_◕ ༽つ ==== Stock has been added ==== ༼ つ ◕_◕ ༽つ =================================");
              console.log("\n \n We now have : " + newStock + " item(s) in stock ===============================================  Tell your friends about this great deal !")
       searchManager();
            });
    }

    function addNewProduct(){
        inquirer.prompt([
            {
                type: "input",
                name: "itemName",
                message: "What is the name of the item to add?"
            },
            {
                type: "input",
                name: "itemDepartment",
                message: "What is the department of the item to add?"
            },
            {
                type: "input",
                name: "itemQuantity",
                message: "What is the quantity of the item to add?"
            },
            {
                type: "input",
                name: "itemPrice",
                message: "What is the price of the item to add?"
            },
            {
                type: "input",
                name: "itemid",
                message: "What is the id number of the item? (please include # )"
            }
        ]).then(function(answer) {
            //store the user's input in variables
            var itemName = answer.itemName;
            var itemDepartment = answer.itemDepartment;
            var itemQuantity = parseInt(answer.itemQuantity);
            var itemPrice = parseFloat(answer.itemPrice);
            var itemId = answer.itemid;
            //check the database for the item by Id
            connection.query("INSERT INTO products SET ?", {"item_id": itemId ,"product_name": itemName, "department_name": itemDepartment, "price": itemPrice, "stock_quantity": itemQuantity}, function (error, results, fields) {
                // error will be an Error if one occurred during the query 
                if (error) {
                    console.log("Error: " + error);
                    return;
                };
                //display a note that the item has been added   
                console.log("Your item has been added");
                searchManager();
            });
        });
    }
    
