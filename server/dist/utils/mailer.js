"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.transporter = nodemailer_1.default.createTransport({
    service: 'gmail', // ou 'hotmail', 'outlook'...
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});
const sendResetPasswordEmail = async (to, token) => {
    const resetUrl = `http://localhost:3000/reset-password/${token}`;
    await exports.transporter.sendMail({
        from: `"Quiz App" <${process.env.MAIL_USER}>`,
        to,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
      <h3>Vous avez demandé à réinitialiser votre mot de passe</h3>
      <p>Cliquez sur le lien ci-dessous pour choisir un nouveau mot de passe :</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Ce lien expire dans 1 heure.</p>
    `,
    });
};
exports.sendResetPasswordEmail = sendResetPasswordEmail;
