// routes/inventoryRoutes.ts
// Rutas del inventario/alacena — fusión de main y feature/jorge-backend
import { Router } from 'express';
import { body } from 'express-validator';
import {
  getInventory,
  addInventoryItem,
  updateItem,
  deleteItem,
} from '../controllers/inventoryController';
import { protect } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validate';

const router = Router();

// ─── Rutas base (main) ────────────────────────────────────────────────────────
// GET  /api/inventory         — obtener alacena del usuario
router.get('/', protect, getInventory);

// POST /api/inventory         — agregar ingrediente
router.post(
  '/',
  protect,
  [
    body('name').notEmpty().withMessage('El nombre es requerido').trim().escape(),
    body('quantity')
      .isNumeric().withMessage('La cantidad debe ser un número')
      .isFloat({ min: 0 }).withMessage('La cantidad mínima es 0'),
    body('unit').optional().isString().trim().escape(),
    body('category').notEmpty().withMessage('La categoría es requerida').trim().escape(),
  ],
  validate,
  addInventoryItem
);

// PUT    /api/inventory/:id   — actualizar ingrediente por _id
router.put('/:id', protect, updateItem);

// DELETE /api/inventory/:id   — eliminar ingrediente por _id
router.delete('/:id', protect, deleteItem);

// ─── Alias de compatibilidad con feature/jorge-backend ───────────────────────
// Las rutas /items/:itemId de Jorge apuntan a los mismos controladores
// para que cualquier cliente que use esa convención siga funcionando.
// PUT    /api/inventory/items/:itemId
router.put('/items/:itemId', protect, (req, res, next) => {
  req.params.id = req.params.itemId;
  next();
}, updateItem);

// DELETE /api/inventory/items/:itemId
router.delete('/items/:itemId', protect, (req, res, next) => {
  req.params.id = req.params.itemId;
  next();
}, deleteItem);

export default router;
