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

connection.connect(function (err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	connection.end();
});

