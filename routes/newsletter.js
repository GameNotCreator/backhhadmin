const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const cookieParser = require('cookie-parser');
router.use(cookieParser());

module.exports = (db) => {
    const transporter = nodemailer.createTransport({
        service: 'Outlook365', // Pour utiliser Outlook/Office365
        auth: {
          user: 'handh.corp@outlook.com', // Remplacez par votre adresse e-mail Outlook
          pass: 'Didou12+', // Remplacez par votre mot de passe Outlook
        },
      });

    const getEmailList = async (db) => {
        const users = await db.collection('newsletter').find({}, { projection: { email: 1, _id: 0 } }).toArray();
        return users.map(user => user.email);
    };

    router.post('/send-newsletter', async (req, res) => {
        try {
            const title = req.body.title;
            const content = req.body.content;
            // Récupérez les adresses e-mail de vos utilisateurs ici
            const emailList = await getEmailList(db);

            // Pour chaque adresse e-mail, envoyez un e-mail avec le titre et le contenu de la newsletter
            for (const email of emailList) {
                await transporter.sendMail({
                    from: 'handh.corp@outlook.com',
                    to: email,
                    subject: title,
                    html: content,
                });
            }

            res.status(200).json({ message: 'Newsletter envoyée avec succès' });
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la newsletter:', error);
            res.status(500).json({ message: 'Erreur lors de l\'envoi de la newsletter' });
        }
    });
  return router;
};
