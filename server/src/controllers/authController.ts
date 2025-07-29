import { Request, Response } from 'express';
import Profile from '../models/userModel';

// Interface pour le corps de la requête de création/mise à jour de profil
interface ProfileRequestBody {
  username: string;
  name: string;
  weightClass: string;
  squat: string;
  bench: string;
  deadlift: string;
  profileImage?: string;
}

// Récupérer le profil d'un utilisateur
export const getProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    
    let profile = await Profile.findOne({ username });
    
    // Si le profil n'existe pas, on retourne 404
    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer un nouveau profil
export const createProfile = async (req: Request<{}, {}, ProfileRequestBody>, res: Response) => {
  try {
    const { username, name, weightClass, squat, bench, deadlift, profileImage } = req.body;
    
    // Vérifier si un profil existe déjà pour cet utilisateur
    const existingProfile = await Profile.findOne({ username });
    if (existingProfile) {
      return res.status(400).json({ message: 'Un profil existe déjà pour cet utilisateur' });
    }
    
    const profile = new Profile({
      username,
      name,
      weightClass,
      squat,
      bench,
      deadlift,
      profileImage
    });
    
    const savedProfile = await profile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error('Erreur lors de la création du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour un profil existant
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, weightClass, squat, bench, deadlift, profileImage } = req.body;
    
    const profile = await Profile.findByIdAndUpdate(
      id,
      { name, weightClass, squat, bench, deadlift, profileImage },
      { new: true, runValidators: true }
    );
    
    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};