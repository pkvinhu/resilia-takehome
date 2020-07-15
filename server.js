'use strict';

const express = require('express');
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');

const app = express();
app.set('port', PORT);
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.json({
    extended: true
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// set the home page route
app.get('/', (req, res) => {
    // ejs render automatically looks in the views folder
    res.render('index', { data: require('./js/astute-req') });
});

var server = app.use((req, res) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE')
    res.header("Access-Control-Allow-Headers", 'Content-Type, Authorization, Content-Length, X-Requested-With');
}).listen(PORT, () => console.log(`Listening on ${ PORT }`));