import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: 'gmail', // ou 'hotmail', 'outlook'...
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, 
  },
});

export const sendResetPasswordEmail = async (to: string, token: string) => {
  const resetUrl = `http://localhost:3000/reset-password/${token}`;

  await transporter.sendMail({
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
