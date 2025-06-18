// models/Annonce.js
const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema({
  conducteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conducteur',
    required: true
  },
  lieuDepart: {
    type: String,
    required: true
  },
  etapesIntermediaires: [{
    ville: String,
    heureArrivee: Date
  }],
  destinationFinale: {
    type: String,
    required: true
  },
  dateDepart: {
    type: Date,
    required: true
  },
  heureDepart: {
    type: String,
    required: true
  },
  dimensionsMax: {
    longueur: Number,
    largeur: Number,
    hauteur: Number
  },
  typeMarchandise: {
    type: String,
    enum: ['fragile', 'liquide', 'alimentaire', 'electronique', 'autre'],
    required: true
  },
  capaciteDisponible: {
    type: Number,
    required: true
  },
  prix: {
    type: Number,
    required: true
  },
  statut: {
    type: String,
    enum: ['active', 'complete', 'annulee'],
    default: 'active'
  },
  instructions: String,
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateModification: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Annonce', annonceSchema);