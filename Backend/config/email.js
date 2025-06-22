const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const sendNotificationEmail = async (userEmail, type, data) => {
  let subject, html;

  switch (type) {
    case 'demande_accepted':
      subject = 'Votre demande de transport a été acceptée';
      html = `
        <h2>Demande acceptée</h2>
        <p>Votre demande de transport a été acceptée par le conducteur.</p>
        <p>Détails du trajet: ${data.trajetDetails}</p>
        <p>Contact du conducteur: ${data.conducteurContact}</p>
      `;
      break;
    
    case 'demande_refused':
      subject = 'Mise à jour sur votre demande de transport';
      html = `
        <h2>Demande refusée</h2>
        <p>Votre demande de transport a été refusée par le conducteur.</p>
        <p>Raison: ${data.reason || 'Non spécifiée'}</p>
      `;
      break;
    
    case 'new_demande':
      subject = 'Nouvelle demande de transport reçue';
      html = `
        <h2>Nouvelle demande</h2>
        <p>Vous avez reçu une nouvelle demande de transport.</p>
        <p>Détails du colis: ${data.colisDetails}</p>
        <p>Contact de l'expéditeur: ${data.expediteurContact}</p>
      `;
      break;
    
    default:
      subject = 'Notification TransportConnect';
      html = '<p>Vous avez reçu une notification de TransportConnect.</p>';
  }

  return sendEmail(userEmail, subject, html);
};

module.exports = {
  transporter,
  sendEmail,
  sendNotificationEmail
};
