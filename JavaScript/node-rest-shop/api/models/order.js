const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
    __id: mongoose.Schema.Types.ObjectId,
    // Connecting each order to a product
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // because it is the name of product module ("export....")
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
});

module.exports = mongoose.model("Order", orderSchema);
