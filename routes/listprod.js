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
            res.write(".checkout-btn { background-color: #3498db; color: #fff; padding: 10px; text-decoration: none; margin-right: 10px; }");
            res.write(".continue-shopping-btn { background-color: #8c6d50; color: #fff; padding: 5px; text-decoration: none; }");
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

            res.write("<body>")
            res.write('<form method="get" action="listprod" style="margin-bottom: 20px; text-align: center;">');
            res.write('<select size="1" name="categoryName">');
            res.write('<option>All</option>');
            res.write('<option>Coffee Beans</option>');
            res.write('<option>Coffee Grounds</option>');
            res.write('<option>Compostable Pods</option>');
            res.write('<option>Decaf</option>');
            res.write('<option>Merchandise</option>'); 
            res.write('</select>');
            res.write('<input type="text" name="productName" placeholder="Search for products..." style="padding: 10px; width: 300px;">');
            res.write('<input type="submit" value="Submit"><input type="reset" value="Reset">');
            res.write('</form>');
            
            let sqlQuery = false;
            let filter = false;
            let name = req.query.productName;
            let category = req.query.categoryName;
            // Truthy conversion for parameters
            let hasNameParam = name !== undefined && name !== "";
            let hasCategoryParam = category !== undefined && category !== "" && category.toUpperCase() !== "ALL";
            let products = false;

            if (hasNameParam && hasCategoryParam) {
                filter = "<h2>Products containing '" + name + "' in category: '" + category + "'</h2>";
                name = '%' + name + '%';
                sqlQuery = "SELECT productId, productName, productPrice, categoryName FROM Product P JOIN Category C ON P.categoryId = C.categoryId WHERE productName LIKE @name AND categoryName = @category";
            } else if (hasNameParam) {
                filter = "<h2>Products containing '" + name + "'</h2>";
                name = '%' + name + '%';
                sqlQuery = "SELECT productId, productName, productPrice, categoryName FROM Product P JOIN Category C ON P.categoryId = C.categoryId WHERE productName LIKE @name";
            } else if (hasCategoryParam) {
                filter = "<h2>Products in category: '" + category + "'</h2>";
                sqlQuery = "SELECT productId, productName, productPrice, categoryName FROM Product P JOIN Category C ON P.categoryId = C.categoryId WHERE categoryName = @category";
            } else {
                filter = "<h2>All Products</h2>";
                sqlQuery = "SELECT productId, productName, productPrice, categoryName FROM Product P JOIN Category C ON P.categoryId = C.categoryId";
            }

            res.write(filter);

            if (hasNameParam) {
                if (hasCategoryParam) {
                    products = await pool.request()
                        .input('name', sql.VarChar, name)
                        .input('category', sql.VarChar, category)
                        .query(sqlQuery);
                } else {
                    products = await pool.request()
                        .input('name', sql.VarChar, name)
                        .query(sqlQuery);
                }
            } else if (hasCategoryParam) {
                products = await pool.request()
                    .input('category', sql.VarChar, category)
                    .query(sqlQuery);
            } else {
                products = await pool.request()
                    .query(sqlQuery);
            }

            res.write("<table><tr><th></th><th>Product Name</th><th>Price</th></tr>");
            for (let i = 0; i < products.recordset.length; i++) {
                let product = products.recordset[i];
                res.write("<tr><td><a href=\"addcart?id=" + product.productId + "&name=" + product.productName + "&price=" + product.productPrice.toFixed(2) + "\" class=\"continue-shopping-btn\">Add to Cart</a></td>");
                res.write("<td><a href=\"product?id=" + product.productId + "\" >" + product.productName + "</a></td><td>$" + product.productPrice.toFixed(2) + "</td></tr>");
            }
            res.write("</table>");
            res.write("</body>")

            res.end()
        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;
