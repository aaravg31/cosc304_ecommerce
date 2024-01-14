const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    let productList = false;
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


    if (req.session.productList) {
        productList = req.session.productList;
        res.write("<h1>Your Shopping Cart</h1>");
        res.write("<table><tr><th>Product Id</th><th>Product Name</th><th>Quantity</th>");
        res.write("<th>Price</th><th>Subtotal</th></tr>");

        let total = 0;
        for (let i = 0; i < productList.length; i++) {
            product = productList[i];

            if (!product) {
                continue
            }

            res.write("<tr><td>" + product.id + "</td>");
            res.write("<td>" + product.name + "</td>");

            res.write("<td align=\"center\">" + product.quantity + "</td>");

            res.write("<td align=\"right\">$" + Number(product.price).toFixed(2) + "</td>");
            res.write("<td align=\"right\">$" + (Number(product.quantity.toFixed(2)) * Number(product.price)).toFixed(2) + "</td>");
            //res.write("<td>");
            //res.write("<form method='post' action='/showcart'>");
            //res.write("<input type='hidden' name='productId' value='"+ product.id + "'>");
            //res.write("<button type='submit'>Delete</button>");
            //res.write("</form>");
            //res.write("</td>");
            res.write("</tr>");
            total = total + product.quantity * product.price;
        }
        res.write("<tr class=\"total-row\"><td colspan=\"4\" align=\"right\"><b>Order Total</b></td><td align=\"right\">$" + total.toFixed(2) + "</td></tr>");
        res.write("</table>");

        req.session.productList = productList;
        res.write("<h2><a href=\"checkout\" class=\"checkout-btn\">Check Out</a></h2>");
    } else{
        res.write("<h1>Your shopping cart is empty!</h1>");
    }
    res.write('<h2><a href="listprod" class="continue-shopping-btn">Continue Shopping</a></h2>');

    res.end();
});

router.post('/', function(req, res, next) {
    let productList = false;
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>Your Shopping Cart</title>");

    let deleteId = false;
    if (req.body.productId && Number.isInteger(parseInt(req.body.productId))) {
        deleteId = parseInt(req.body.productId);
    }
    res.write(""+req.session.productList.length);
    let newProductList = [];
    if (req.session.productList) {
        productList = req.session.productList;
        res.write("<h1>Your Shopping Cart</h1>");
        res.write("<table><tr><th>Product Id</th><th>Product Name</th><th>Quantity</th>");
        res.write("<th>Price</th><th>Subtotal</th></tr>");

        let total = 0;
        for (let i = 0; i < productList.length; i++) {
            product = productList[i];

            if(deleteId === product.id){
                continue;
            }

            if (!product) {
                continue
            }

            res.write("<tr><td>" + product.id + "</td>");
            res.write("<td>" + product.name + "</td>");

            res.write("<td align=\"center\">" + product.quantity + "</td>");

            res.write("<td align=\"right\">$" + Number(product.price).toFixed(2) + "</td>");
            res.write("<td align=\"right\">$" + (Number(product.quantity.toFixed(2)) * Number(product.price)).toFixed(2) + "</td>");
            res.write("<td>");
            res.write("<form method='post' action='/showcart'>");
            res.write("<input type='hidden' name='productId' value='" + product.id + "'>");
            res.write("<button type='submit'>Delete</button>");
            res.write("</form>");
            res.write("</td>");
            res.write("</tr>");
            total = total + product.quantity * product.price;

            newProductList.push(product);
        }
        res.write("<tr><td colspan=\"4\" align=\"right\"><b>Order Total</b></td><td align=\"right\">$" + total.toFixed(2) + "</td></tr>");
        res.write("</table>");

        req.session.productList = newProductList;
        res.write("<h2><a href=\"checkout\">Check Out</a></h2>");
    } else{
        res.write("<h1>Your shopping cart is empty!</h1>");
    }
    res.write('<h2><a href="listprod">Continue Shopping</a></h2>');

    res.end();
});

module.exports = router;
