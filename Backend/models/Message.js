const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  expediteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destinataire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  annonce: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Annonce',
    required: true
  },
  contenu: {
    type: String,
    required: true,
    trim: true
  },
  lu: {
    type: Boolean,
    default: false
  },
  dateEnvoi: {
    type: Date,
    default: Date.now
  }
});

// Index pour améliorer les performances
messageSchema.index({ expediteur: 1, destinataire: 1, annonce: 1 });
messageSchema.index({ destinataire: 1, lu: 1 });

module.exports = mongoose.model('Message', messageSchema); 