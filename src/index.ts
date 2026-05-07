import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import inventoryRoutes from "./routes/inventory.routes";
import businessRoutes from "./routes/business.routes";

import { connectDB } from "./config/db";

dotenv.config();

const app = express();

app.use(express.json());

/* 🔥 MONGOOSE */
mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch((err) => console.log("❌ Error MongoDB:", err));

/* 🔥 MONGODB NATIVE DRIVER */
connectDB();

/* 🔽 ROOT */
app.get("/", (req, res) => {
    res.send("Servidor funcionando 🚀");
});

/* 🔽 POST — crear */
app.post("/recetas", (req, res) => {

    console.log(req.body);

    res.json({
        mensaje: "Receta creada",
        data: req.body
    });

});

/* 🔽 PUT — actualizar */
app.put("/recetas/:id", (req, res) => {

    const id = req.params.id;

    res.json({
        mensaje: "Receta actualizada",
        id: id,
        cambios: req.body
    });

});

/* 🔥 INVENTORY */
app.use("/api/inventory", inventoryRoutes);

/* 🔥 BUSINESS */
app.use("/api/business", businessRoutes);

/* 🔥 SERVER */
app.listen(process.env.PORT, () => {
    console.log(`🚀 Servidor en puerto ${process.env.PORT}`);
});