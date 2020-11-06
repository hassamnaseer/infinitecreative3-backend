const express = require("express");
const { saveOrders, getOrders } = require("../controllers/orders");

const router = express.Router();

router.post("/orders/save", saveOrders);
router.get("/orders/all", getOrders);

module.exports = router;
