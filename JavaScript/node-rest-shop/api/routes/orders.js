const express = require("express");
const router = express.Router();

const OrderController = require("../controllers/orders");
const checkAuth = require("../middleware/check-auth");

router.get("/", OrderController.get_all_orders);
router.get("/:orderId", OrderController.get_order);

router.post("/", checkAuth, OrderController.post_order);

router.delete("/:orderId", checkAuth, OrderController.delete_order);

module.exports = router;
