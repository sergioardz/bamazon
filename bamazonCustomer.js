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
	connection.end();
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
			if (response[i].stock_quantity > 0) {
				console.log(
					response[i].item_id + " || " +
					response[i].product_name + " || " +
					response[i].price + " || " + "\n")
			}
		}
	})
};

