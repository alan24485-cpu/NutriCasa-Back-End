import { Request, Response } from "express";
import Inventory from "../models/inventory.model";

export const updateInventoryItem = async (req: any, res: Response) => {

    try {

        const userId = req.userId;
        const itemId = req.params.itemId;
        const updates = req.body;

        const setFields: any = {};

        for (const key in updates) {
            setFields[`items.$.${key}`] = updates[key];
        }

        const inventory = await Inventory.findOneAndUpdate(
            { userId: userId, "items._id": itemId },
            { $set: setFields },
            { new: true }
        );

        if (!inventory) {
            return res.status(404).json({ message: "Item o alacena no encontrado" });
        }

        res.status(200).json(inventory);

    } catch (error) {

        res.status(500).json({ message: "Error actualizando item" });

    }

};
export const deleteInventoryItem = async (req: any, res: Response) => {

    try {

        const userId = req.userId;
        const itemId = req.params.itemId;

        const inventory = await Inventory.findOneAndUpdate(
            { userId: userId },
            { $pull: { items: { _id: itemId } } },
            { new: true }
        );

        if (!inventory) {
            return res.status(404).json({ message: "Alacena no encontrada" });
        }

        res.status(200).json({ message: "Item eliminado correctamente" });

    } catch (error) {

        res.status(500).json({ message: "Error eliminando item" });

    }

};