import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import inventoryRoutes from "./routes/inventory.routes";

dotenv.config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch((err) => console.log("❌ Error MongoDB:", err));

app.get("/", (req, res) => {
    res.send("Servidor funcionando 🚀");
});

app.use("/api/inventory", inventoryRoutes);

app.listen(process.env.PORT, () => {
    console.log(`🚀 Servidor en puerto ${process.env.PORT}`);
});