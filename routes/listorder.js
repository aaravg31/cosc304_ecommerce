const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);

            res.write("<style>");
            res.write("body { font-family: 'Merriweather', serif; line-height: 1.6; margin: 0; padding: 0; background-color: #fff; color: #1a1a1a; }");
            res.write("header { background-color: #8c6d50; color: #1a1a1a; padding: 10px; text-align: center; margin-bottom: 0px; position: relative; }");
            res.write("header a { color: #1a1a1a; padding: 10px; margin: 10px; border-radius: 5px; display: inline-block; background-color: #8c6d50;}");
            res.write("header img { position: absolute; top: 20%; transform: translateY(-50%); left: 10px; width: 100px; height: auto; }");
            res.write("nav { display: flex; justify-content: space-between; align-items: center; background-color: #8c6d50; }");
            res.write("nav a { color: #1a1a1a; text-decoration: none; margin-right: 10px; display: inline-block; }"); 
            res.write("h1, h2, h3 { font-family: 'Merriweather', serif; color: #1a1a1a; text-align: center; }");
            res.write("h1 { font-size: 36px; margin: 0; font-weight: bold;}");
            res.write("h3 { float: right; }");
            res.write("main { padding: 20px; text-align: center; }");
            res.write("a { color: #000000; text-decoration: none; }");
            res.write("a:hover { text-decoration: underline; }");
            res.write("input[type='submit'] { background-color: #000000; color: #fff; padding: 10px; cursor: pointer; }");
            res.write("input[type='reset'] { background-color: #000000; color: #fff; padding: 10px; cursor: pointer; }");
            res.write("table { width: 70%; margin: 0 auto; border-collapse: collapse; margin-top: 20px; border: 2px solid #8c6d50; }");
            res.write("th, td { border: 2px solid #000000; padding: 6px; text-align: left; }");
            res.write("th { background-color: #8c6d50; color: #fff; }");
            res.write(".total-row { background-color: #f2f2f2; }");
            res.write(".checkout-btn { background-color: #000000; color: #fff; padding: 10px; text-decoration: none; margin-right: 10px; border-radius: 5px; }");
            res.write(".continue-shopping-btn { background-color: #000000; color: #fff; padding: 5px; text-decoration: none; border-radius: 5px; }");
            res.write("body::after { content: 'Grind & Co.'; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); transform-origin: 0 0; font-size: 36px; color: #008000; opacity: 0.5; pointer-events: none; z-index: 1000; }");
            res.write("</style>");
            res.write("</head>");
            res.write("<body>");
            res.write("<header>");
            res.write('<img src="img/logo.png" alt="Logo">');
            res.write('<h1><a href="/">Grind & Co.</a></h1>');
            res.write("<nav>");
            res.write('<div>'); 
            res.write('<h3><a href="/listprod" class="nav-link">[Shop]</a></h3>');
            res.write('<h3><a href="/admin" class="nav-link">[Admin] </a></h3>');
            res.write('<h3><a href="/customer" class="nav-link">[Customer] </a></h3>');
            res.write('</div>');
            if(req.session.authenticatedUser){
                username = req.session.authenticatedUser
                res.write('<span class="nav-link" style="text-align: right; margin-left: auto;">Signed in as: ' + username + '</span>');
                res.write('<h3><a href="/logout" class="nav-link">[Logout] </a></h3>');
        
            }else{
                res.write('<h3><a href="/login" class="nav-link">[Login] </a></h3>');
            }
            res.write("</nav>");
            res.write("</header>");

            let sqlQuery = "SELECT orderId, O.CustomerId, totalAmount, firstName+' '+lastName as cname, orderDate FROM OrderSummary O, Customer C WHERE O.customerId = C.customerId";
            let result = await pool.request().query(sqlQuery);
            
            res.write("<h1>Order List</h1>");
            res.write('<table border=\"1\"><tr><th>Order Id</th><th>Order Date</th><th>Customer Id</th><th>Customer Name</th><th>Total Amount</th></tr>');

            for (let i = 0; i < result.recordset.length; i++) {
                let record = result.recordset[i];
                orderId = record.orderId;
                orderDate = new Date(record.orderDate);
                res.write("<tr><td>" + orderId + "</td>");
                res.write("<td>" + moment(orderDate).format('Y-MM-DD HH:mm:ss') + "</td>");
                res.write("<td>" + record.CustomerId + "</td>");
                res.write("<td>" + record.cname + "</td>");
                res.write("<td>$" + record.totalAmount.toFixed(2) + "</td>");
                res.write("</tr>");

                let orderedProducts = await pool.request()
                    .input('id', sql.Int, orderId)
                    .query('SELECT productId, quantity, price FROM OrderProduct WHERE orderId=@id')
                
                res.write("<tr align=\"right\"><td colspan=\"5\"><table border=\"1\">");
                res.write("<th>Product Id</th> <th>Quantity</th> <th>Price</th></tr>");
                for (let j = 0; j < orderedProducts.recordset.length; j++) {
                    let product = orderedProducts.recordset[j];
                    res.write("<tr><td>" + product.productId + "</td>");
                    res.write("<td>" + product.quantity + "</td>");
                    res.write("<td>$" + product.price.toFixed(2) + "</td></tr>");
                }
                res.write("</table></td></tr>");
            }

            res.write("</table>");

            res.end();
        } catch(err) {
            console.dir(err);
            res.write(err + "");
            res.write("<h3>Has the data been loaded?</h3>")
            res.end();
        }
    })();
});

module.exports = router;
