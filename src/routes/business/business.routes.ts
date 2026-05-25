// routes/business/business.routes.ts
// Rutas del módulo de negocios locales (Jorge)
// Usa el middleware `protect` real de main (JWT verificado), no el stub de Jorge
import { Router } from 'express';
import {
  getAllBusinesses,
  getBusinessById,
  getNearbyBusinesses,
} from '../../controllers/business/business.controller';
import { protect } from '../../middlewares/authMiddleware';

const router = Router();

// GET /api/business?lat=X&lng=Y&category=Z&minRating=N  — búsqueda geográfica
router.get('/', protect, getNearbyBusinesses);

// GET /api/business/all  — todos los negocios (admin/listado)
router.get('/all', protect, getAllBusinesses);

// GET /api/business/:id  — negocio específico
router.get('/:id', protect, getBusinessById);

export default router;
