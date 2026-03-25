import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    unit: String,
    category: String,
    expiresAt: Date
});

const inventorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [itemSchema]
});

export default mongoose.model("Inventory", inventorySchema);