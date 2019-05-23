// First app of the HW Assignment

// Require modules/packages
var mysql = require("mysql");
var inquirer = require("inquirer");

// Set connection to MySQL
var connection = mysql.createConnection({
	host: "localhost",
	// Your port; if not 3306
	port: 3306,
	// Your username
	user: "root",
	// Your password
	password: "Agu4c4t3",
	database: "bamazon"
});

// Test Connection and Welcome message!
connection.connect(function (err) {
	if (err) throw err;
	console.log(
		"=====================================================" +
		"\nWelcome to Bamazon!, These are the available items: " +
		"\n=====================================================");
	displayItems();
	// connection.end();
});


// First Function that displays all product information, including a header
// And checking if there are items in stock, if not, they won't show
var displayItems = function () {
	connection.query("SELECT * FROM products", function (err, response) {
		if (err) throw err;
		console.log(
			"ID || Product || Price USD " +
			"\n-----------------------------------------------------");
		for (i = 0; i < response.length; i++) {
			console.log(
				response[i].item_id + " || " +
				response[i].product_name + " || " +
				response[i].price + " || " + "\n")

		}
		promptUsers(response);
	})
};

// Second Function

var promptUsers = function (response) {
	var itemsAvailable = [];
	for (i = 0; i < response.length; i++) {
		itemsAvailable.push("" + response[i].item_id + "");
	}
	inquirer.prompt([
		{
			type: "input",
			name: "itemid",
			message: "Which product would you like to buy?, please type in the ID"
		},
		{
			type: "number",
			name: "units",
			message: "How many units of this product would you like to buy?"
		}]).then(function (answer) {
			var id = answer.itemid - 1;
			if (itemsAvailable.includes("" + (answer.itemid) + "")) {
				var units = answer.units;
				if (Number.isInteger(units)) {
					if (units > 0) {
						var newStock = response[id].stock_quantity - units
						var product = response[id].product_name;
						if (newStock >= 0) {
							connection.query("UPDATE products SET stock_quantity='" + newStock + "' WHERE item_id='" + response[answer.itemid - 1].item_id + "'", function (err, res) {
								console.log("Your order: " + units + " of " + product + " is processed with a total of: " + (units * response[answer.itemid - 1].price + " USD"));
								inquirer.prompt([
									{
										type: "confirm",
										name: "continue",
										message: "Continue shopping?"
									}]).then(function (answer) {
										if (answer.continue) {
											displayItems();
										} else {
											connection.end();
										}
									})
							})
						} else {
							console.log("There is not enough stock to fulfill your order");
							promptUsers(response);
						}
					} else {
						console.log("Your selection of number of units to buy is not valid");
						promptUsers(response);
					}
				} else {
					console.log("Your selection is not a valid number");
					promptUsers(response);
				}
			} else {
				console.log("Your selection was not recognized. Please select again");
				promptUsers(response);
			}
		})
};

// console.log(product);
// console.log(units);
// console.log("Your order is " + units + " units of " + product);
// console.log("yes");