import { Request, Response } from "express";
import { BusinessRepository } from "../repositories/business.repository";
import { ObjectId } from "mongodb";

export const getAllBusinesses = async (req: Request, res: Response) => {

    try {

        const businesses = await BusinessRepository.getAllBusinesses();

        res.json(businesses);

    } catch (error) {

        res.status(500).json({
            message: "Error obteniendo negocios"
        });

    }

};

export const getBusinessById = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        // ✅ Validar ObjectId
        if (!ObjectId.isValid(id)) {

            return res.status(400).json({
                message: "ID inválido"
            });

        }

        const business = await BusinessRepository.getBusinessById(id);

        if (!business) {

            return res.status(404).json({
                message: "Negocio no encontrado"
            });

        }

        res.json(business);

    } catch (error) {

        res.status(500).json({
            message: "Error obteniendo negocio"
        });

    }

};

/* 🔥 BÚSQUEDA GEO + FILTROS */
export const getNearbyBusinesses = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            lat,
            lng,
            category,
            minRating
        } = req.query;

        // ✅ Validar coordenadas
        if (!lat || !lng) {

            return res.status(400).json({
                message: "Latitud y longitud requeridas"
            });

        }

        const businesses =
            await BusinessRepository.getNearbyBusinesses(

                Number(lat),
                Number(lng),

                category as string,

                minRating
                    ? Number(minRating)
                    : undefined

            );

        res.json(businesses);

    } catch (error) {

        res.status(500).json({
            message: "Error buscando negocios"
        });

    }

};