// repositories/business.repository.ts
// Módulo de Jorge: búsqueda de negocios con geolocalización (MongoDB Native Driver)
import { ObjectId } from 'mongodb';
import { getNativeDb } from '../config/db';

export const BusinessRepository = {

  async getAllBusinesses() {
    const db = getNativeDb();
    return await db.collection('business').find({}).toArray();
  },

  async getBusinessById(id: string) {
    const db = getNativeDb();
    return await db.collection('business').findOne({ _id: new ObjectId(id) });
  },

  /**
   * Búsqueda geográfica con filtros opcionales de categoría y rating mínimo.
   * Requiere índice 2dsphere en el campo `location` de la colección business.
   */
  async getNearbyBusinesses(
    lat: number,
    lng: number,
    category?: string,
    minRating?: number
  ) {
    const db = getNativeDb();
    const filters: Record<string, any> = {};

    if (category && typeof category === 'string') {
      filters.category = category;
    }

    if (minRating && !isNaN(minRating)) {
      filters.averageRating = { $gte: minRating };
    }

    return await db
      .collection('business')
      .find({
        ...filters,
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [lng, lat] },
            $maxDistance: 5000,
          },
        },
      })
      .project({ name: 1, address: 1, averageRating: 1, category: 1 })
      .toArray();
  },
};
