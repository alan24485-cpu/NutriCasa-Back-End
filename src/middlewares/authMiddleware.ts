import { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {

    // 🔥 MODO PRUEBA (sin token)
    req.userId = "65f000000000000000000001";

    next();
};