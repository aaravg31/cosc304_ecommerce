const express = require('express');
const router = express.Router();
const auth = require('../auth');
const sql = require('mssql');

router.get('/', async function(req, res, next) {
    // Stop rendering the page if we aren't authenticated
    res.setHeader('Content-Type', 'text/html');
    res.write("<style>");
    res.write("body { font-family: 'Merriweather', serif; line-height: 1.6; margin: 0; padding: 0; background-color: #fff; color: #1a1a1a; }");
    res.write("header { background-color: #8c6d50; color: #1a1a1a; padding: 10px; text-align: center; margin-bottom: 0px; position: relative; }");
    res.write("header a { color: #1a1a1a; padding: 10px; margin: 10px; border-radius: 5px; display: inline-block; background-color: #8c6d50;}");
    res.write("header img { position: absolute; top: 50%; transform: translateY(-50%); left: 10px; width: 100px; height: auto; }");
    res.write("nav { display: flex; justify-content: space-between; align-items: center; background-color: #8c6d50; }");
    res.write("nav a { color: #1a1a1a; text-decoration: none; margin-right: 10px; display: inline-block; }"); 
    res.write("h1, h2, h3 { font-family: 'Merriweather', serif; color: #1a1a1a; text-align: center; }");
    res.write("h1 { font-size: 36px; margin: 0; font-weight: bold;}");
    res.write("h3 { float: right; }");
    res.write("main { padding: 20px; text-align: center; }");
    res.write("a { color: #000000; text-decoration: none; }");
    res.write("a:hover { text-decoration: underline; }");
    res.write("form { max-width: 400px; margin: 0 auto; text-align: left; }");
    res.write("label { display: block; margin-bottom: 5px; }");
    res.write("input { width: calc(100% - 12px); padding: 8px; box-sizing: border-box; margin-bottom: 10px; }");
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
    res.write("</header>");

    (async function() {
        try {
            let pool = await sql.connect(dbConfig);

            res.write(`<form method="post" action="/createCust">
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" name="firstName" required><br>

            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" name="lastName" required><br>

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required><br>

            <label for="phone">Phone Number:</label>
            <input type="tel" id="phone" name="phone" required><br>

            <label for="address">Address:</label>
            <input type="text" id="address" name="address" required><br>

            <label for="city">City:</label>
            <input type="text" id="city" name="city" required><br>

            <label for="state">State:</label>
            <input type="text" id="state" name="state" required><br>

            <label for="postalCode">Postal Code:</label>
            <input type="text" id="postalCode" name="postalCode" required><br>

            <label for="country">Country:</label>
            <input type="text" id="country" name="country" required><br>

            <label for="userid">User ID:</label>
            <input type="text" id="userid" name="userid" required><br>

            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required><br>

            <input type="submit" value="Submit">
            </form>`);


            res.end();
        } catch(err) {
            console.dir(err);
            res.write(err + "");
            res.end();
        }
    })();
});

router.post('/', async function(req, res, next) {
    try {
        let pool = await sql.connect(dbConfig);

        const {firstName,lastName,email,phone,address,city,state,postalCode,country,userid,password} = req.body;

        const query = `INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES (@firstName, @lastName, @email, @phone, @address, @city, @state, @postalCode, @country, @userid, @password)`;

        const result = await pool.request()
            .input('firstName', sql.VarChar, firstName)
            .input('lastName', sql.VarChar, lastName)
            .input('email', sql.VarChar, email)
            .input('phone', sql.VarChar, phone)
            .input('address', sql.VarChar, address)
            .input('city', sql.VarChar, city)
            .input('state', sql.VarChar, state)
            .input('postalCode', sql.VarChar, postalCode)
            .input('country', sql.VarChar, country)
            .input('userid', sql.VarChar, userid)
            .input('password', sql.VarChar, password)
            .query(query);

        res.write('Customer record inserted successfully!');
    } catch (err) {
        console.dir(err);
        res.status(500).send(err.message);
    }
});

module.exports = router;
