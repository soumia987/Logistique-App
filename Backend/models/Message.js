// models/Message.js
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
    required: true
  },
 
  dateEnvoi: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);