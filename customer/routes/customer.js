var express = require("express");
var db = require("../models");
var OrderService = require("../services/OrderService");
var orderService = new OrderService(db);
var bodyParser = require("body-parser");
//var jsonParser = bodyParser.json();
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//customer orders something

router.post("/", async function (req, res, next) {
  //get body check it because it comes from 3 alerts.
  const { FirstName, LastName, DishName } = req.body;
  //validate add later schema validator if you have time

  if (!FirstName || !LastName || !DishName) {
    return res.status(400).send("All fields are required");
  }

  try {
    //create new order
    const newOrder = await orderService.create({
      FirstName,
      LastName,
      DishName,
    });
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("ERror createing order ", error);
    res.status(500).send("Failed to create order");
  }
});

module.exports = router;
