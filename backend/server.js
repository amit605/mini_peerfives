const express = require("express");
const path = require("path");
const httpreq = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');  
const services = require('./services/service');
const request = require("request"); 
const helpers = require("./helpers/helpers");

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const router = express.Router();   

/**** Middlewares *****/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

/*** routitng statrt here ****/
app.use("/user",require('./controllers/api/user.controller'));

// for Local server use
const port = process.env.PORT || 8000;

httpreq.createServer(app).listen( port, ()=>{
    console.log('Server running on port ',port);
});



