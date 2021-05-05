var dotenv =  require('dotenv')
dotenv.config()
var express = require( "express");
var morgan = require( "morgan");
var bodyParser = require( "body-parser");
var expressValidator = require("express-validator");
var db = require( "./src/db");
// const auth = require("./src/middleware/auth").default;
const port = process.env.PORT || 9004;
const path = require("path");
var forceSsl = require('express-force-ssl');
const fs = require('fs');
var minify = require('express-minify');
var compression = require('compression');
const https = require('https');
var http = require('http');

const env = process.env.NODE_ENV;


const app = express();
module.exports = app;


app.use(morgan(env));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());

app.all(process.env.API_BASE + "*", (req, res, next) => {
    req.user = {
        "_id": "1",
        "firstName": "Jhone",
        "lastName": "Doe",
        "email": "jhone.doe@example.com",
        "username": "jhone.doe"
    }
    next();
});


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'ui/build')));

require("./src/routes")(app);

if(env && (env == "production" || env == "PRODUCTION")){
    //in case you want to enable ssl uncomment the commented code
    // app.set('forceSSLOptions', {
    //     enable301Redirects: true,
    //     trustXFPHeader: false,
    //     httpsPort: 443,
    //     sslRequiredMessage: 'SSL Required.'
    // });
    // app.use(forceSsl);
    app.use(compression());
    app.use(minify());

    // var https_options = {
    //     key: fs.readFileSync(path.join(__dirname, 'ssl/private.key')),
    //     cert: fs.readFileSync(path.join(__dirname, 'ssl/certificate.crt')),
    //     ca: fs.readFileSync(path.join(__dirname, 'ssl/ca_bundle.crt')),
    //     secure: true
    // };
    // https.createServer(https_options, app).listen(443, () => {
    //     console.log(`working on port ${443}`);
    // });
    http.createServer(app).listen(80);
}else{
    app.listen(port,function(){
        console.log(`Working on port ${port}`);
    });
}