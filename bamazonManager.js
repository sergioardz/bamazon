// Second app of the HW Assignment - Challenge # 2
require("dotenv").config();
// Require modules/packages
var mysql = require("mysql");
var inquirer = require("inquirer");
// Set connection to MySQL & Test Connection
var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: process.env.MYSQL_PASSWORD,
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log(
        "=====================================================" +
        "\n     Manager Module ---- Select an option: " +
        "\n=====================================================");
    selectOption();
});
// First Function to handle the selected action from the user
var selectOption = function () {
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "Options: ",
            choices: [
                "View Products Available",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit Module"
            ]
        }]).then(function (answer) {
            switch (answer.action) {
                case "View Products Available":
                    displayAvailableItems();
                    break;
                case "View Low Inventory":
                    displayLow();
                    break;
                case "Add to Inventory":
                    displayAllItems();
                    break;
                case "Add New Product":
                    promptProduct();
                    break;
                case "Exit Module":
                    exit();
                    break;
            }
        });
};

// Second Function to exit App
var exit = function () {
    connection.end();
};

// Third Function recycled from Customer App, with few changes
var displayAvailableItems = function () {
    connection.query("SELECT * FROM products WHERE stock_quantity > 0", function (err, response) {
        if (err) throw err;
        console.log(
            "ID || Product || Price USD || Stock " +
            "\n-----------------------------------------------------");
        for (i = 0; i < response.length; i++) {
            console.log(
                response[i].item_id + " || " +
                response[i].product_name + " || " +
                response[i].price + " || " +
                response[i].stock_quantity + " || " + "\n");
        }
        selectOption();
    })
};

// Fourth Function recycled again, specifically for items with stock below 5 units
var displayLow = function () {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, response) {
        if (err) throw err;
        if (response.length < 1) {
            console.log("All products have at least 5 units available");
        } else {
            console.log(
                "ID || Product || Price USD || Stock " +
                "\n-----------------------------------------------------");
            for (i = 0; i < response.length; i++) {
                console.log(
                    response[i].item_id + " || " +
                    response[i].product_name + " || " +
                    response[i].price + " || " +
                    response[i].stock_quantity + " || " + "\n");
            }
        }
        selectOption();
    })
};

// Fifth Function to handle the replenishment of products
var replenishItems = function (response) {
    // Create an array to catch all IDs from which the customer can choose
    var itemsAvailable = [];
    for (i = 0; i < response.length; i++) {
        itemsAvailable.push("" + response[i].item_id + "");
    }
    inquirer.prompt([
        {
            type: "input",
            name: "itemid",
            message: "Which product would you like to replenish?, please type in the ID"
        },
        {
            type: "number",
            name: "units",
            message: "How many units of this product would you like to replenish?"
        }]).then(function (answer) {
            var id = answer.itemid - 1;
            // Validate the chosen ID
            if (itemsAvailable.includes("" + (answer.itemid) + "")) {
                var units = answer.units;
                // Validate if the quantity is an integer
                if (Number.isInteger(units)) {
                    // Validate if the quantity is greater than zero
                    if (units > 0) {
                        var newStock = response[id].stock_quantity + units
                        var product = response[id].product_name;
                        connection.query("UPDATE products SET stock_quantity='" + newStock + "' WHERE item_id='" + response[answer.itemid - 1].item_id + "'", function (err, res) {
                            console.log("Your product: " + product + " has been replenish to a total stock quantity of: " + newStock);
                            inquirer.prompt([
                                {
                                    type: "confirm",
                                    name: "continue",
                                    message: "Another product to replenish?"
                                }]).then(function (answer) {
                                    // Validate if the customer wants to continue replenishing inventory
                                    if (answer.continue) {
                                        displayAllItems();
                                    } else {
                                        connection.end();
                                    }
                                })
                        })
                    } else {
                        console.log("Your input is not valid. Units less than zero");
                        replenishItems(response);
                    }
                } else {
                    console.log("Your selection is not a valid number");
                    replenishItems(response);
                }
            } else {
                console.log("Your selection was not recognized. Please select again");
                replenishItems(response);
            }
        })
};

// Sixth Function to handle adding products to the bamazon store
var newProduct = function (name, department, price, stock) {
    connection.query("INSERT INTO products SET ?",
        {
            product_name: name,
            department_name: department,
            price: price,
            stock_quantity: stock
        },
        function (err, res) {
            console.log("New Product succesfully added");
            selectOption();
        })
};

// Seventh Function recycled from First App to display ALL items, in order to chose on to replenish
var displayAllItems = function () {
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
        console.log(
            "ID || Product || Price USD || Stock " +
            "\n-----------------------------------------------------");
        for (i = 0; i < response.length; i++) {
            console.log(
                response[i].item_id + " || " +
                response[i].product_name + " || " +
                response[i].price + " || " +
                response[i].stock_quantity + " || " + "\n");
        }
        replenishItems(response);
    })
};

// Last Function to handle posting a new product to the DB together with newProduct function
var promptProduct = function () {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Type in the name of the new product"
        },
        {
            type: "input",
            name: "department",
            message: "Type in the department name of the new product"
        },
        {
            type: "number",
            name: "price",
            message: "Type in the price of the new product",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            type: "number",
            name: "stock",
            message: "How many units of the new product will be added to the store",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        },
    ]).then(function (answer) {
        newProduct(
            answer.name,
            answer.department,
            answer.price,
            answer.stock);
    })
};