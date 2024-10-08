var express = require("express");
var router = express.Router();

var db = require("../models");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    // Raw query for total number of all orders
    const [allOrders] = await db.sequelize.query(
      "SELECT COUNT(*) AS totalOrders FROM Orders"
    );

    // Raw query for number of active orders (use 1 instead of true for SQL Server)
    const [activeOrders] = await db.sequelize.query(
      "SELECT COUNT(*) AS activeOrders FROM Orders WHERE Active = 1"
    );

    // Raw query for the two most popular dishes (using TOP 2 for SQL Server)
    const [popularDishes] = await db.sequelize.query(`
      SELECT TOP 2 DishName, COUNT(*) AS count 
      FROM Orders 
      GROUP BY DishName 
      ORDER BY count DESC
    `);

    // Render the result on the page
    res.render("index", {
      active: activeOrders[0].activeOrders,
      all: allOrders[0].totalOrders,
      popular: popularDishes,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).send("Failed to fetch statistics");
  }
});

module.exports = router;
