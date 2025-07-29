import express from 'express';
import { register, login } from '../controllers/authController';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { transporter } from '../utils/mailer';

const router = express.Router();

// 📌 Inscription
router.post('/register', register);

// 📌 Connexion
router.post('/login', login);

// 🔐 Mot de passe oublié : envoie un email contenant un lien de réinitialisation
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requis.' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 3600000); // expire dans 1h

    user.resetToken = token;
    user.resetTokenExpiration = expiration;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    // 📧 Envoi de l'email
    await transporter.sendMail({
      from: `"PowerLifting Quiz" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <h2>Salut ${user.username},</h2>
        <p>Vous avez oublié votre mot de passe ? Pas de panique, ça arrive !</p>
        <p>Cliquez sur le lien suivant pour le réinitialiser :</p>
        <a href="${resetLink}">${resetLink}</a>
        <p><i>Ce lien expire dans 1 heure.</i></p>
        <p><i>Si vous n’avez pas fait cette demande, ignorez simplement ce message — personne ne pourra accéder à votre compte.</i></p>
        <p>À bientôt sur PowerLifting Quiz !</p>
        <p><strong>L’équipe support</strong></p>
      `,
    });

    res.json({ message: 'Un email de réinitialisation a été envoyé.' });
  } catch (err) {
    console.error('Erreur forgot-password :', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// 🔐 Réinitialisation du mot de passe via le lien reçu
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token et nouveau mot de passe requis.' });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Lien invalide ou expiré.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (err) {
    console.error('Erreur reset-password :', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

export default router;
