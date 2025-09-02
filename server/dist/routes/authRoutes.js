"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const mailer_1 = require("../utils/mailer");
const router = express_1.default.Router();
// 📌 Inscription
router.post('/register', authController_1.register);
// 📌 Connexion
router.post('/login', authController_1.login);
// 🔐 Mot de passe oublié : envoie un email contenant un lien de réinitialisation
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ error: 'Email requis.' });
    try {
        const user = await userModel_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        const token = crypto_1.default.randomBytes(32).toString('hex');
        const expiration = new Date(Date.now() + 3600000); // expire dans 1h
        user.resetToken = token;
        user.resetTokenExpiration = expiration;
        await user.save();
        const resetLink = `http://localhost:3000/reset-password/${token}`;
        // 📧 Envoi de l'email
        await mailer_1.transporter.sendMail({
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
    }
    catch (err) {
        console.error('Erreur forgot-password :', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});
// 🔐 Réinitialisation du mot de passe via le lien reçu
router.post('/reset-password', async (req, res) => {
    console.log('=== DEBUG RESET PASSWORD ===');
    console.log('Token reçu:', req.body.token);
    console.log('Longueur du token:', req.body.token?.length);
    console.log('Type du token:', typeof req.body.token);
    console.log('Nouveau mot de passe fourni:', !!req.body.newPassword);
    try {
        // Vérifiez si le token existe dans votre base de données
        const resetToken = await userModel_1.default.findOne({
            resetToken: req.body.token,
            // Vérifiez aussi l'expiration si vous en avez une
            resetTokenExpires: { $gt: Date.now() }
        });
        console.log('Token trouvé dans la DB:', !!resetToken);
        if (resetToken) {
            console.log('Token expires at:', resetToken.resetToken);
            console.log('Current time:', Date.now());
        }
        if (!resetToken) {
            console.log('ERREUR: Token non trouvé ou expiré');
            return res.status(400).json({ error: "Lien invalide ou expiré." });
        }
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token et nouveau mot de passe requis.' });
        }
        try {
            const user = await userModel_1.default.findOne({
                resetToken: token,
                resetTokenExpiration: { $gt: new Date() },
            });
            if (!user) {
                return res.status(400).json({ error: 'Lien invalide ou expiré.' });
            }
            user.password = await bcrypt_1.default.hash(newPassword, 10);
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            await user.save();
            res.json({ message: 'Mot de passe mis à jour avec succès.' });
        }
        catch (err) {
            console.error('Erreur reset-password :', err);
            res.status(500).json({ error: 'Erreur serveur.' });
        }
    }
    catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});
exports.default = router;
