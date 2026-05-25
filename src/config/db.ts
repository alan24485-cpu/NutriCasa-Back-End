// config/db.ts — Conexión dual: Mongoose (ORM) + MongoDB Native Driver (business module)
import mongoose from 'mongoose';
import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// ─── Mongoose (ORM principal) ─────────────────────────────────────────────────
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('✅ Mongoose conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando Mongoose a MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;

// ─── MongoDB Native Driver (para business / geolocalización) ──────────────────
let nativeClient: MongoClient | null = null;
let nativeDb: Db | null = null;

export const connectNativeDB = async (): Promise<void> => {
  try {
    nativeClient = new MongoClient(process.env.MONGO_URI as string);
    await nativeClient.connect();
    // Usa el nombre de DB de la URI o 'nutricasa' por defecto
    const dbName = process.env.MONGO_DB_NAME || 'nutricasa';
    nativeDb = nativeClient.db(dbName);
    console.log(`✅ MongoDB Native Driver conectado (db: ${dbName})`);
  } catch (error) {
    console.error('❌ Error conectando MongoDB Native Driver:', error);
    // No hacer process.exit aquí — el módulo de business es opcional
  }
};

/**
 * Retorna la instancia del Native Driver.
 * Lanza un error descriptivo si no se inicializó.
 */
export const getNativeDb = (): Db => {
  if (!nativeDb) {
    throw new Error('MongoDB Native Driver no inicializado. Llama a connectNativeDB() primero.');
  }
  return nativeDb;
};

// Compatibilidad con la importación `{ db }` que usa business.repository.ts de Jorge
export { nativeDb as db };
