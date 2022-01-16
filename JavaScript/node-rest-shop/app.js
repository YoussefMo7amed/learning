const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// require("dotenv").config();
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");

const MONGO_ATALS_USERNAME = process.env.MONGO_ATALS_USERNAME;
const MONGO_ATALS_PASSWORD = process.env.MONGO_ATALS_PASSWORD;

const uri = `mongodb+srv://${MONGO_ATALS_USERNAME}:${MONGO_ATALS_PASSWORD}@cluster0.inzbm.mongodb.net/restshop?retryWrites=true&w=majority`;
mongoose.connect(uri);
mongoose.Promise = global.Promise;
app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header(
            "Access-Control-Allow-Methods",
            "PUT, POST, PATCH, DELETE, GET"
        );
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

module.exports = app;
