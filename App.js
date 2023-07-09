const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", function (req, res) {
  const data = {
    email_address: req.body.email,
    status: "subscribed",
    merge_fields: {
      FNAME: req.body.fName,
      LNAME: req.body.lName,
    },
  };
  const jsonDATA = JSON.stringify(data);
  const url =
    "https://us18.api.mailchimp.com/3.0/lists/" +
    process.env.ID +
    "/members?skip_merge_validation=false";
  const options = {
    method: "POST",

    auth: process.env.KEY,
  };

  const requst = https.request(url, options, function (response) {
    response.on("data", function (data) {
      //   console.log(response);
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");

        // res.send(JSON.parse(data).detail)
      }
    });
  });

  requst.write(jsonDATA);
  requst.end();
});

app.post("/failure", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.listen(process.env.PORT || 3000, function () {
  //process.env.PORT-this is added to run this on heroku also
  console.log("server started at 3000");
});
