const express = require('express');
const router = express.Router();
const sql = require('mssql');

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
            res.write(".image-container { display: flex; }");
            res.write(".image-container img { margin: 0; padding: 0; vertical-align: middle;  max-width: 100%; max-height: 200px;}");
            res.write("img.centered { display: block; margin: 0 auto; border-radius: 10px;}");
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

            let sqlQuery = "SELECT productId, productName, productPrice, productImageURL, productImage FROM Product P  WHERE productId = @id";
            let productId = req.query.id;

            if (productId === undefined || productId === "") {
                res.write("Invalid product");
                res.end();
                return;
            }

            result = await pool.request()
                .input('id', sql.Int, productId)
                .query(sqlQuery);

            if (result.recordset.length === 0) {
                res.write("Invalid product");
            } else {
                let product = result.recordset[0];

                res.write("<h1>" + product.productName + "</h1>");
		
                res.write("<table><tr>");
                res.write("<th>Id</th><td>" + product.productId + "</td></tr>"				
                        + "<tr><th>Price</th><td>$" + product.productPrice.toFixed(2) + "</td></tr>");
                
                //  Retrieve any image with a URL
                imageLoc = product.productImageURL;
                res.write("<div class=\"image-container\">");
                if (imageLoc != null)
                    res.write("<img src=\"img/" + imageLoc + "\" class=\"centered\">");
                
                // Retrieve any image stored directly in database
                imageBinary = product.productImage;
                if (imageBinary != null)
                    res.write("<img src=\"displayImage?id=" + product.productId + "\" class=\"centered\">");	
                res.write("</div>");
                res.write("</table>");
                

                res.write("<h2><a href=\"addcart?id=" + product.productId + "&name=" + product.productName
                                        + "&price=" + product.productPrice + "\" class=\"continue-shopping-btn\">Add to Cart</a></h2>");		
                
                res.write("<h2><a href=\"listprod\" class=\"continue-shopping-btn\">Continue Shopping</a></h2>");
            }

            res.end()
        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;
