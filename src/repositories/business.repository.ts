import { ObjectId } from "mongodb";
import { db } from "../config/db";

export const BusinessRepository = {

    async getAllBusinesses() {

        return await db.collection("business")
            .find({})
            .toArray();

    },

    async getBusinessById(id: string) {

        return await db.collection("business")
            .findOne({
                _id: new ObjectId(id)
            });

    },

    /* 🔥 BÚSQUEDA GEO + FILTROS */
    async getNearbyBusinesses(
        lat: number,
        lng: number,
        category?: string,
        minRating?: number
    ) {

        // ✅ FILTRO DINÁMICO
        const filters: any = {};

        // ✅ Sanitización básica
        if (category && typeof category === "string") {

            filters.category = category;

        }

        if (minRating && !isNaN(minRating)) {

            filters.averageRating = {
                $gte: minRating
            };

        }

        return await db.collection("business")
            .find({

                ...filters,

                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [lng, lat]
                        },

                        $maxDistance: 5000
                    }
                }
            })

            .project({
                name: 1,
                address: 1,
                averageRating: 1,
                category: 1
            })

            .toArray();

    }

};