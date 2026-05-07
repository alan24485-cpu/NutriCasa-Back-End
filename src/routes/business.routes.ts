import { Router } from "express";

import {
    getAllBusinesses,
    getBusinessById,
    getNearbyBusinesses
} from "../controllers/business.controller";

const router = Router();

/* 🔥 BÚSQUEDA GEOGRÁFICA */
router.get("/", getNearbyBusinesses);

/* 🔥 TODOS LOS NEGOCIOS */
router.get("/all", getAllBusinesses);

/* 🔥 NEGOCIO POR ID */
router.get("/:id", getBusinessById);

export default router;