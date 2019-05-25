
use bamazon;

insert into products(product_name, department_name, price, stock_quantity)
values ("Alpha Tablet", "Electronics", 399.99, 250),
	("Moby Dick", "Books", 19.99, 140),
    ("Jaws", "Films", 9.99, 80),
    ("Super TV", "Electronics", 599.99, 40),
    ("The Odissey", "Books", 14.99, 160),
    ("Gremlins", "Films", 9.99, 45),
    ("USB Drive", "Electronics", 7.99, 350),
    ("Hamlet", "Books", 16.99, 180),
    ("Forrest Gump", "Films", 12.99, 100),
    ("Megasmart Phone", "Electronics", 299.99, 120);

select * from products;

