import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    imageUrl: {
        type: String
    },

    category: {
        type: String
    },

    difficulty: {
        type: String,
        enum: ["fácil", "media", "difícil"]
    }

}, {
    timestamps: true
});

export default mongoose.model("Recipe", recipeSchema);