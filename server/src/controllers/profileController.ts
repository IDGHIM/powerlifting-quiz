import { Request, Response } from 'express';
import Profile from '../models/profileModel';

interface ProfileRequestBody {
  username: string;
  name: string;
  weightClass: string;
  squat: string;
  bench: string;
  deadlift: string;
  profileImage?: string;
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    let profile = await Profile.findOne({ username });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createProfile = async (req: Request<{}, {}, ProfileRequestBody>, res: Response) => {
  try {
    const { username, name, weightClass, squat, bench, deadlift, profileImage } = req.body;
    
    const existingProfile = await Profile.findOne({ username });
    if (existingProfile) {
      return res.status(400).json({ message: 'Un profil existe déjà pour cet utilisateur' });
    }
    
    const profile = new Profile({
      username, name, weightClass, squat, bench, deadlift, profileImage
    });
    
    const savedProfile = await profile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error('Erreur lors de la création du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

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