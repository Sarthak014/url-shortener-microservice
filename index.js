require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

require("url");
const bodyParser = require("body-parser");
const { isUrlValid } = require("./utilities/validator/url");

let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}

// Accessing dns module
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res, next) {
  res.json({ greeting: "hello API" });

  next();
});

const { createAndSaveUrl } = require("./controller/createAndFindUrl");
app.post("/api/shorturl", function (req, res, next) {
  const inputUrl = req.body.url;

  if (!inputUrl || !isUrlValid(inputUrl)) {
    return res.status(400).json({ error: "invalid url" });
  }

  const dnsOptions = {
    family: 0,
    hints: dns.ADDRCONFIG | dns.V4MAPPED,
    all: true,
  };
  const parsedUrl = new URL(inputUrl);
  const hostname = parsedUrl.hostname;

  dns.lookup(hostname, dnsOptions, async (error, addresses) => {
    if (error) {
      return res.json({ error: "Invalid Hostname" });
    } else {
      createAndSaveUrl(inputUrl, function (err, data) {
        if (err) {
          return next(err);
        }
        if (!data) {
          console.log("Missing `done()` argument");
          return next({ message: "Missing callback argument" });
        }
        return res.json(data);
      });
    }
  });
});

const { findUrlByCode } = require("./controller/createAndFindUrl");
app.get("/api/shorturl/:shortUrlId", function (req, res, next) {
  const { shortUrlId } = req.params;

  findUrlByCode(shortUrlId, function (err, data) {
    if (err) {
      return next(err);
    }
    if (!data) {
      console.log("Missing `done()` argument");
      return next({ message: "Missing callback argument" });
    }

    return res.redirect(data);
  });
});

// Error handler
app.use(function (err, req, res, next) {
  if (err) {
    res
      .status(err.status || 500)
      .type("txt")
      .send(err.message || "SERVER ERROR");
  }
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error");
  });

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
