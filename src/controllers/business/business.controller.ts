// controllers/business/business.controller.ts
// Módulo de Jorge: gestión de negocios locales con geolocalización
import { Request, Response } from 'express';
import { BusinessRepository } from '../../repositories/business.repository';
import { ObjectId } from 'mongodb';

export const getAllBusinesses = async (req: Request, res: Response): Promise<void> => {
  try {
    const businesses = await BusinessRepository.getAllBusinesses();
    res.json({ success: true, data: businesses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error obteniendo negocios' });
  }
};

export const getBusinessById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idStr = typeof id === "string" ? id : Array.isArray(id) ? id[0] : "";

    if (!ObjectId.isValid(idStr)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const business = await BusinessRepository.getBusinessById(idStr);

    if (!business) {
      res.status(404).json({ success: false, message: 'Negocio no encontrado' });
      return;
    }

    res.json({ success: true, data: business });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error obteniendo negocio' });
  }
};

/**
 * GET /api/business?lat=19.4&lng=-99.1&category=restaurante&minRating=4
 * Búsqueda de negocios cercanos con filtros opcionales.
 */
export const getNearbyBusinesses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lat, lng, category, minRating } = req.query;

    if (!lat || !lng) {
      res.status(400).json({ success: false, message: 'Latitud y longitud son requeridas' });
      return;
    }

    const businesses = await BusinessRepository.getNearbyBusinesses(
      Number(lat),
      Number(lng),
      category as string,
      minRating ? Number(minRating) : undefined
    );

    res.json({ success: true, data: businesses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error buscando negocios cercanos' });
  }
};
