import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt_clé';

router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Champs requis : username, password' });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, passwordHash, role: role || 'user' });
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (error) {
    console.error('Erreur /register:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du compte' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Erreur /login:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
});

export default router;
