import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Comment from '../models/Comment.model';
import Recipe  from '../models/Recipe.model';
import User    from '../models/User.model';

async function cleanOrphans() {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log('✅ Conectado a MongoDB');

  const comments = await Comment.find({});
  let deleted = 0;

  for (const c of comments) {
    const recipeExists = await Recipe.findById(c.recipeId);
    const userExists   = await User.findById(c.userId);

    if (!recipeExists || !userExists) {
      await Comment.findByIdAndDelete(c._id);
      deleted++;
      console.log(`🗑️ Eliminado comentario huérfano: ${c._id}`);
    }
  }

  console.log(`\n✅ Limpieza completa. ${deleted} comentario(s) eliminado(s).`);
  await mongoose.disconnect();
}

cleanOrphans().catch(console.error);