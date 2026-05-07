import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI as string);

let db: any;

export const connectDB = async () => {
    try {

        await client.connect();

        db = client.db("recetario");

        console.log("✅ MongoDB Native Driver conectado");

    } catch (error) {

        console.log("❌ Error Native Driver:", error);

    }
};

export { db };