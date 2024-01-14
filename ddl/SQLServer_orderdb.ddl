CREATE DATABASE orders;
go

USE orders;
go

DROP TABLE review;
DROP TABLE shipment;
DROP TABLE productinventory;
DROP TABLE warehouse;
DROP TABLE orderproduct;
DROP TABLE incart;
DROP TABLE product;
DROP TABLE category;
DROP TABLE ordersummary;
DROP TABLE paymentmethod;
DROP TABLE customer;


CREATE TABLE customer (
    customerId          INT IDENTITY,
    firstName           VARCHAR(40),
    lastName            VARCHAR(40),
    email               VARCHAR(50),
    phonenum            VARCHAR(20),
    address             VARCHAR(50),
    city                VARCHAR(40),
    state               VARCHAR(20),
    postalCode          VARCHAR(20),
    country             VARCHAR(40),
    userid              VARCHAR(20),
    password            VARCHAR(30),
    PRIMARY KEY (customerId)
);

CREATE TABLE paymentmethod (
    paymentMethodId     INT IDENTITY,
    paymentType         VARCHAR(20),
    paymentNumber       VARCHAR(30),
    paymentExpiryDate   DATE,
    customerId          INT,
    PRIMARY KEY (paymentMethodId),
    FOREIGN KEY (customerId) REFERENCES customer(customerid)
        ON UPDATE CASCADE ON DELETE CASCADE 
);

CREATE TABLE ordersummary (
    orderId             INT IDENTITY,
    orderDate           DATETIME,
    totalAmount         DECIMAL(10,2),
    shiptoAddress       VARCHAR(50),
    shiptoCity          VARCHAR(40),
    shiptoState         VARCHAR(20),
    shiptoPostalCode    VARCHAR(20),
    shiptoCountry       VARCHAR(40),
    customerId          INT,
    PRIMARY KEY (orderId),
    FOREIGN KEY (customerId) REFERENCES customer(customerid)
        ON UPDATE CASCADE ON DELETE CASCADE 
);

CREATE TABLE category (
    categoryId          INT IDENTITY,
    categoryName        VARCHAR(50),    
    PRIMARY KEY (categoryId)
);

CREATE TABLE product (
    productId           INT IDENTITY,
    productName         VARCHAR(40),
    productPrice        DECIMAL(10,2),
    productImageURL     VARCHAR(100),
    productImage        VARBINARY(MAX),
    productDesc         VARCHAR(1000),
    categoryId          INT,
    PRIMARY KEY (productId),
    FOREIGN KEY (categoryId) REFERENCES category(categoryId)
);

CREATE TABLE orderproduct (
    orderId             INT,
    productId           INT,
    quantity            INT,
    price               DECIMAL(10,2),  
    PRIMARY KEY (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES ordersummary(orderId)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE incart (
    orderId             INT,
    productId           INT,
    quantity            INT,
    price               DECIMAL(10,2),  
    PRIMARY KEY (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES ordersummary(orderId)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE warehouse (
    warehouseId         INT IDENTITY,
    warehouseName       VARCHAR(30),    
    PRIMARY KEY (warehouseId)
);

CREATE TABLE shipment (
    shipmentId          INT IDENTITY,
    shipmentDate        DATETIME,   
    shipmentDesc        VARCHAR(100),   
    warehouseId         INT, 
    PRIMARY KEY (shipmentId),
    FOREIGN KEY (warehouseId) REFERENCES warehouse(warehouseId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE productinventory ( 
    productId           INT,
    warehouseId         INT,
    quantity            INT,
    price               DECIMAL(10,2),  
    PRIMARY KEY (productId, warehouseId),   
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (warehouseId) REFERENCES warehouse(warehouseId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE review (
    reviewId            INT IDENTITY,
    reviewRating        INT,
    reviewDate          DATETIME,   
    customerId          INT,
    productId           INT,
    reviewComment       VARCHAR(1000),          
    PRIMARY KEY (reviewId),
    FOREIGN KEY (customerId) REFERENCES customer(customerId)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO category(categoryName) VALUES ('Coffee Beans');
INSERT INTO category(categoryName) VALUES ('Coffee Grounds');
INSERT INTO category(categoryName) VALUES ('Compostable Pods');
INSERT INTO category(categoryName) VALUES ('Decaf');
INSERT INTO category(categoryName) VALUES ('Merchandise');

- - Products - -

INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('A Dark Affair - Whole Beans', 1 ,'Dark Roast - Whole Beans (300 g)', 15.00),'A_dark_affair.png';
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('A Dark Affair - Grounds ', 2 ,'Dark Roast - Grounds (300 g)', 16.00, 'A_dark_affair.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('A Dark Affair - Compostable Pods', 3 ,'Dark Roast - Compostable Pods (18 Pods)', 17.00, 'Pods.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('A Dark Affair - Whole Beans Decaffinated', 4 ,'Dark Roast - Whole Beans Decaffinated (300 g)', 16.00, 'A_dark_affair.png');

INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Farmers Blend - Whole Beans', 1 ,'Medium Roast - Whole Beans (300 g)', 15.00, 'Farmers_Blend.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Farmers Blend - Grounds ', 2 ,'Medium Roast - Grounds (300 g)', 16.00, 'Farmers_Blend.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Farmers Blend - Compostable Pods', 3 ,'Medium Roast - Compostable Pods (18 Pods)', 17.00, 'Pods.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Farmers Blend - Whole Beans Decaffinated', 4 ,'Medium Roast - Whole Beans Decaffinated (300 g)', 16.00, 'Farmers_Blend.png');

INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Tanzania Peaberry - Whole Beans', 1 ,'Medium Roast - Whole Beans (300 g)', 16.00, 'Tanzania_Peaberry.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Tanzania Peaberry - Grounds ', 2 ,'Medium Roast - Grounds (300 g)', 17.00, 'Tanzania_Peaberry.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Tanzania Peaberry - Compostable Pods', 3 ,'Medium Roast - Compostable Pods (18 Pods)', 18.00, 'Pods.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Tanzania Peaberry - Whole Beans Decaffinated', 4 ,'Medium Roast - Whole Beans Decaffinated (300 g)', 17.00, 'Tanzania_Peaberry.png');

INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Arabica - Whole Beans', 1 ,'Light Roast - Whole Beans (300 g)', 15.00, 'Arabica.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Arabica - Grounds ', 2 ,'Light Roast - Grounds (300 g)', 16.00, 'Arabica.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Arabica - Compostable Pods', 3 ,'Light Roast - Compostable Pods (18 Pods)', 17.00, 'Pods.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Arabica - Whole Beans Decaffinated', 4 ,'Light Roast - Whole Beans Decaffinated (300 g)', 16.00, 'Arabica.png');

INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Bourbon Pointu - Whole Beans', 1 ,'Dark Roast - Whole Beans (300 g)', 15.00, 'Bourbon_Pointu.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Bourbon Pointu - Grounds ', 2 ,'Dark Roast - Grounds (300 g)', 16.00, 'Bourbon_Pointu.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Bourbon Pointu - Compostable Pods', 3 ,'Dark Roast - Compostable Pods (18 Pods)', 17.00, 'Pods.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Bourbon Pointu - Whole Beans Decaffinated', 4 ,'Dark Roast - Whole Beans Decaffinated (300 g)', 16.00, 'Bourbon_Pointu.png');

INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Kopi Luwak - Whole Beans', 1 ,'Light Roast - Whole Beans (300 g)', 15.00, 'Kopi_Luwak.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Kopi Luwak - Grounds ', 2 ,'Light Roast - Grounds (300 g)', 16.00, 'Kopi_Luwak.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Kopi Luwak - Compostable Pods', 3 ,'Light Roast - Compostable Pods (18 Pods)', 17.00, 'Pods.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Kopi Luwak - Whole Beans Decaffinated', 4 ,'Light Roast - Whole Beans Decaffinated (300 g)', 16.00, 'Kopi_Luwak.png');

INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Online Gift Card', 5 ,'Shopping for someone else but not sure what to give them? Give them the gift of choice with an Online Grind & Co's Coffee Roasters gift card.', 20.00, 'Online_gift_card.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Cafe Gift Card', 5 ,'Perfect for any coffee lover in your life to use towards purchases at any Grind and Co's café location. *In-store use only, not valid for online orders.', 20.00, 'Instore_gift_card.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Mug', 5 ,'11 oz Grind & Co. Mug', 14.00, 'Mug.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('French Press', 5 ,'15 oz insulated Grind & Co. French Press', 35.00, 'French_Press.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Travel Mug', 5 ,'12 oz insulated Grind & Co. Travel Mug', 19.00, 'Travel_Mug.png');
INSERT product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Frother', 5 ,'Grind & Co. premium Frother', 10.00, 'Frother.png');


INSERT INTO warehouse(warehouseName) VALUES ('Main warehouse');
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (1, 1, 5, 18);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (2, 1, 10, 19);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (3, 1, 3, 10);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (4, 1, 2, 22);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (5, 1, 6, 21.35);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (6, 1, 3, 25);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (7, 1, 1, 30);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (8, 1, 0, 40);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (9, 1, 2, 97);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (10, 1, 3, 31);

INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Aarav', 'Gosalia', 'aaravg31@gmail.com', '204-111-2222', '103 AnyWhere Street', 'Kelowna', 'BC', 'V1V 1V8', 'Canada', 'aarav' , 'gos');
INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Mariya', 'Putwa', 'mariyaputwa02@gmail.com', '572-342-8911', '222 Bush Avenue', 'Kelowna', 'BC', 'V1V 1V8', 'Canada', 'mariya' , 'put');
INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Cosc', '304-Test', 'cole@charity.org', '333-444-5555', '333 Central Crescent', 'Chicago', 'IL', '33333', 'United States', 'user' , 'password');


-- Order 1 can be shipped as have enough inventory
DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (1, '2023-10-15 10:25:55', 91.70)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 1, 1, 6
)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 5, 2, 21.35)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 10, 1, 31);

DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (2, '2019-10-16 18:00:00', 106.75)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 5, 5, 21.35);

-- Order 3 cannot be shipped as do not have enough inventory for item 7
DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (3, '2019-10-15 3:30:22', 140)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 6, 2, 25)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 7, 3, 30);

DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (2, '2019-10-17 05:45:11', 327.85)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 3, 4, 10)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 8, 3, 40)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 13, 3, 23.25)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 28, 2, 21.05)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 29, 4, 14);

DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (5, '2019-10-15 10:25:55', 277.40)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 5, 4, 21.35)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 19, 2, 81)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 20, 3, 10);




