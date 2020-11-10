"use strict";

require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const request = require("request");
const rp = require("request-promise");
const { sub_key } = process.env;

const app = express();
app.set("port", PORT);
app.use(express.static(__dirname + "/js"));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(
  bodyParser.json({
    extended: true
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// set the home page route
app.get("/", (req, res) => {
  // ejs render automatically looks in the views folder
  res.render("index", { data: require("./astute-req") });
});

app.post("/content", async (req, res) => {
  let { page, city, content, request_values } = req.body;
  console.log(page, city, content);

  let URL = `https://api.aspirelifestyles.com/content/search`;
  let payload = {
    method: "POST",
    headers: {
      "X-Subscription-Key": sub_key
    },
    json: true,
    body: {
      page: page - 1,
      pageSize: 500,
      filters: [
        {
          name: "Content Type",
          values: content
        },
        {
          name: "Request Type",
          values: request_values
        },
        {
          name: "Program ID",
          values: ["Default"]
        },
        {
          name: "City",
          values: city
        }
      ],
      facets: []
    }
  };
  let response;
  rp(URL, payload)
  .then(response => {
    console.log('success');
    res.send(response);
  }).catch(e => {
    console.log(e);
    res.statusCode(404).send({ error: e });
  })
});

app.post("/test", (req, res) => {
  console.log(req.body);
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
