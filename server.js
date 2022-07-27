"use strict";

require("dotenv").config();
var cookieSession = require("cookie-session");
const express = require("express");
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
var quoteGenerator = require("random-quote-generator");

const app = express();

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.cookieKey],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.set("port", PORT);
app.use(express.static(__dirname + "/js"));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(
  bodyParser.json({
    extended: true,
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// set the home page route
app.get("/", (req, res) => {
  res.render("index", {
    data: {
      message: "loaded!",
      notifications: req.session.notifications || [],
    },
  });
});

app.get("/notifications", (req, res) => {
  const quote = quoteGenerator.generateAQuote();
  if (req.session.notifications) {
    req.session.notifications = [...req.session.notifications, quote];
  } else {
    req.session.notifications = [quote];
  }
  res.send({
    message: "success!",
    notifications: req.session.notifications,
  });
});

app.delete("/notifications", (req, res) => {
  if (req.session?.notifications?.length) {
    req.session.notifications = [];
    res.send({
      message: "notifications cleared!",
      notifications: req.session.notifications,
    });
  } else {
    res.send({ message: "no notifications to clear!" });
  }
});

var server = app
  .use((req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Content-Length, X-Requested-With"
    );
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
