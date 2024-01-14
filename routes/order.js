const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', async function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
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
    res.write('<h3><a href="/listorder" class="nav-link">[List order]</a></h3>');
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

    let custId = false;
    if (req.query.customerId && Number.isInteger(parseInt(req.query.customerId))) {
        custId = parseInt(req.query.customerId);
    } else {
        res.write("<h1>Invalid customer id.  Go back to the previous page and try again.</h1>");
        res.end();
        return;
    }
    let productList = false;
    if (req.session.productList && req.session.productList.length > 0) {
        productList = req.session.productList;
    } else {
        res.write("<h1>Your shopping cart is empty!</h1>");
        res.end();
        return;
    }
    try{
        let pool = await sql.connect(dbConfig);
        let password = req.query.pass || null;
            let sqlQueryPass = "SELECT password FROM customer WHERE customerId =" + custId;
            let resultsp = await pool.request().query(sqlQueryPass);
            let resultp = resultsp.recordset[0];
            if(resultp.password != password){
                res.write("<h2>Error: Password doesn't match</h2>");
                res.end();
                return;
            }
    }catch(err){
        console.dir(err);
        res.write(err + "")
        res.end();
    }

    let sqlQuery = "SELECT customerId, firstName+' '+lastName as cname FROM Customer WHERE customerId = @custId";
    let orderId = false;
    let custName = false;
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);

            let result = await pool.request()
                .input('custId', sql.Int, custId)
                .query(sqlQuery);
            custName = result.recordset[0].cname;
            
            let orderDate = moment().format('Y-MM-DD HH:mm:ss');
            sqlQuery = "INSERT INTO OrderSummary (customerId, totalAmount, orderDate) OUTPUT INSERTED.orderId VALUES(@custId, 0, @orderDate);"

            result = await pool.request()
                .input('custId', sql.Int, custId)
                .input('orderDate', sql.DateTime, orderDate)
                .query(sqlQuery);
            
            orderId = result.recordset[0].orderId;

            res.write("<h1>Your Order Summary</h1>");
            res.write("<table><tr><th>Product Id</th><th>Product Name</th><th>Quantity</th><th>Price</th><th>Subtotal</th></tr>");

            total = 0;
            for (let i = 0; i < productList.length; i++) {
                product = productList[i];
                if (!product) {
                    continue
                }

                res.write("<tr><td>" + product.id + " </td>");
                res.write("<td>" + product.name + " </td>");
                res.write("<td align=\"center\">" + product.quantity + " </td>");
                
                price = Number(product.price).toFixed(2);
                quantity = Number(product.quantity);
				res.write("<td align=\"right\">$" + price + " </td>");
               	res.write("<td align=\"right\">$" + (price * quantity).toFixed(2) + " </td></tr>");
                res.write("</tr>");

                total = total + price * quantity;

				sqlQuery = "INSERT INTO OrderProduct VALUES(@orderId, @pid, @quantity, @price)";
                pid = parseInt(product.id);
                
                result = await pool.request()
                    .input('orderId', sql.Int, orderId)
                    .input('pid', sql.Int, pid)
                    .input('quantity', sql.Int, quantity)
                    .input('price', sql.Decimal(10,2), price)
                    .query(sqlQuery);
            }

            res.write("<tr class=\"total-row\"><td colspan=\"4\" align=\"right\"><b>Order Total</b></td>\
                        <td aling=\"right\">$" + total.toFixed(2) + "</td></tr>");
            res.write("</table>");
            
            // Update order total
            console.log(total.toFixed(2));
			sqlQuery = "UPDATE OrderSummary SET totalAmount=@total WHERE orderId=@orderId";
            result = await pool.request()
                .input('total', sql.Decimal(10,2), total.toFixed(2))
                .input('orderId', sql.Int, orderId)
                .query(sqlQuery);

			res.write("<h1>Order completed.  Will be shipped soon...</h1>");
			res.write("<h1>Your order reference number is: " + orderId + "</h1>");
			res.write("<h1>Shipping to customer: " + custId + " Name: " + custName + "</h1>");

			res.write("<h2><a href=\"/listprod\" class=\"checkout-btn\">Return to shopping</a></h2>");
            res.write("</body>");
			
			// Clear session variables (cart)
            req.session.destroy();
            
            res.end();
        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;
