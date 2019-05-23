// First app of the HW Assignment

// Require modules/packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("table");

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


// First Function that displays all product information, including a header and calling the second function at the end for the next steps
var displayItems = function () {
	connection.query("SELECT * FROM products", function (err, response) {
		if (err) throw err;
		console.log(
			"ID || Product || Department || Price || Stock " +
			"\n-----------------------------------------------------"
		);
		for (i = 0; i < response.length; i++) {
			console.log(
				response[i].item_id + " || " +
				response[i].product_name + " || " +
				response[i].department_name + " || " +
				response[i].price + " || " +
				response[i].stock_quantity + "\n"
			);
		}
		// promptUser();
	});
};


// Second Function that will ask the user which id belongs to the product they want to purchase and a second prompt to ask for the quantity to purchase of the selected item
