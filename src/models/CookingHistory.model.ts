import mongoose from "mongoose";

const cookingHistorySchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
        required: true
    },

    cookedAt: {
        type: Date,
        default: Date.now
    },

    rating: {
        type: Number,
        min: 1,
        max: 5
    },

    caloriesConsumed: {
        type: Number,
        default: 0
    },

    estimatedCost: {
        type: Number,
        default: 0
    },

    mealTime: {
        type: String,
        enum: ["desayuno", "comida", "cena", "snack"],
        default: "comida"
    }

}, {
    timestamps: true
});

export default mongoose.model("CookingHistory", cookingHistorySchema);