// models/DemandeTransport.js
const mongoose = require('mongoose');

const demandeTransportSchema = new mongoose.Schema({
  expediteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  annonce: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Annonce',
    required: true
  },
  detailsColis: {
    dimensions: {
      longueur: Number,
      largeur: Number,
      hauteur: Number
    },
    poids: Number,
    type: String,
    description: String
  },
  adresseEnlevement: {
    type: String,
    required: true
  },
  adresseLivraison: {
    type: String,
    required: true
  },
  dateEnlevementSouhaitee: Date,
  dateLivraisonSouhaitee: Date,
  statut: {
    type: String,
    enum: ['en_attente', 'acceptee', 'refusee', 'en_cours', 'livree'],
    default: 'en_attente'
  },
  message: String,
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateModification: {
    type: Date,
    default: Date.now
  }
});

// Index pour améliorer les performances
demandeTransportSchema.index({ expediteur: 1, statut: 1 });
demandeTransportSchema.index({ annonce: 1, statut: 1 });

module.exports = mongoose.model('DemandeTransport', demandeTransportSchema);



// Empecher les evaluations multiples pour la meme demande
evaluationSchema.index({ evaluateur: 1, demandeTransport: 1 }, { unique: true });

module.exports = mongoose.model('Evaluation', evaluationSchema);



