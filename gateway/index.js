const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
//for index html file
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

//for css
app.use(express.static(path.join(__dirname, "public")));

//add also index html to make it easier
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "index.html"); // Assuming the file is named "index.html"
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error loading page.");
    } else {
      res.send(data);
    }
  });
});

app.use("/customer", proxy("http://localhost:8001"));
app.use("/employee", proxy("http://localhost:8002"));
app.use("/management", proxy("http://localhost:8003"));

app.listen(8000, () => {
  console.log("Gateway is running on Port 8000");
});
