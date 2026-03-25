import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import inventoryRoutes from "./routes/inventory.routes";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/inventory", inventoryRoutes);

mongoose.connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log("MongoDB conectado");
    })
    .catch((error) => {
        console.log(error);
    });

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});