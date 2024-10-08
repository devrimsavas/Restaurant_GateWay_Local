var express = require("express");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

var db = require("../models");

var OrderService = require("../services/OrderService");
var orderService = new OrderService(db);
var router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  //get orders from service

  try {
    //get all active orders from orderservice

    console.log("hello from employee get server");

    //const orders = await orderService.getAll();
    const orders = await orderService.getAllActive();
    //test
    // Convert orders to plain JSON objects for logging
    const ordersJSON = orders.map((order) => order.toJSON());

    // Log the orders as plain objects
    console.log("Orders received:", ordersJSON);
    res.render("index", { orders: orders });
    //res.render("index", { orders: [] });
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).send("Failed to fetch orders");
  }
});

router.post("/", async function (req, res, next) {
  // Extract OrderId from the request body
  const { OrderId } = req.body; // This matches "OrderId" in the JSON

  console.log("OrderId received is: ", OrderId);

  // Validate that the OrderId is provided
  if (!OrderId) {
    return res.status(400).send("Order ID is required.");
  }

  try {
    // Mark the order as ready (inactive) using OrderService
    await orderService.orderReady(OrderId);

    // Send a success response after marking as ready
    return res.status(200).send("Order marked as ready.");
  } catch (error) {
    console.error("Error marking order as ready:", error);
    return res.status(500).send("Failed to mark order as ready.");
  }
});

module.exports = router;
