import CookingHistory from '../../models/CookingHistory.model';
import User from '../../models/User.model';
import { Types } from 'mongoose';

export class HistoryService {

  static async getUserHistory(userId: string) {

    // ✅ PASO 1: Validar usuario
    const userExists = await User.findById(userId);

    if (!userExists) {
      throw new Error('Usuario no encontrado');
    }

    // ✅ PASO 2: Obtener historial
    const history = await CookingHistory.find({ userId })
      .populate({
        path: 'recipeId',
        select: 'title imageUrl category difficulty'
      })
      .sort({ cookedAt: -1 })
      .lean()
      .exec();

    // ✅ PASO 3: Formatear datos
    const formattedHistory = history.map((entry: any) => {

      let recipeData = null;

      if (entry.recipeId && typeof entry.recipeId === 'object') {
        const recipe = entry.recipeId;

        recipeData = {
          _id: recipe._id.toString(),
          title: recipe.title,
          imageUrl: recipe.imageUrl,
          category: recipe.category,
          difficulty: recipe.difficulty
        };
      }

      return {
        ...entry,
        _id: entry._id.toString(),
        userId: entry.userId.toString(),
        recipeId: recipeData,
        cookedAt: entry.cookedAt.toISOString(),
        createdAt: entry.createdAt?.toISOString()
      };
    });

    console.log(`Historial encontrado: ${formattedHistory.length}`);

    return formattedHistory;
  }

  // 🔥 EXTRA (estadísticas)
  static async getHistoryStats(userId: string) {

    const stats = await CookingHistory.aggregate([

      { $match: { userId: new Types.ObjectId(userId) } },

      {
        $group: {
          _id: null,
          totalRecetas: { $sum: 1 },
          promedioRating: { $avg: '$rating' },
          totalCalorias: { $sum: '$caloriesConsumed' },
          totalGastado: { $sum: '$estimatedCost' },
          recetasPorComida: { $push: '$mealTime' }
        }
      },

      {
        $project: {
          _id: 0,
          totalRecetas: 1,
          promedioRating: { $round: ['$promedioRating', 1] },
          totalCalorias: 1,
          totalGastado: 1,

          desayunos: {
            $size: {
              $filter: {
                input: '$recetasPorComida',
                as: 'c',
                cond: { $eq: ['$$c', 'desayuno'] }
              }
            }
          },

          comidas: {
            $size: {
              $filter: {
                input: '$recetasPorComida',
                as: 'c',
                cond: { $eq: ['$$c', 'comida'] }
              }
            }
          },

          cenas: {
            $size: {
              $filter: {
                input: '$recetasPorComida',
                as: 'c',
                cond: { $eq: ['$$c', 'cena'] }
              }
            }
          },

          snacks: {
            $size: {
              $filter: {
                input: '$recetasPorComida',
                as: 'c',
                cond: { $eq: ['$$c', 'snack'] }
              }
            }
          }

        }
      }

    ]);

    return stats[0] || {
      totalRecetas: 0,
      promedioRating: 0,
      totalCalorias: 0,
      totalGastado: 0,
      desayunos: 0,
      comidas: 0,
      cenas: 0,
      snacks: 0
    };
  }
}