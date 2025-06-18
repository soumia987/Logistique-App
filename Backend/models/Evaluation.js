// models/Evaluation.js
const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  evaluateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  evalue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  demandeTransport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DemandeTransport',
    required: true
  },
  note: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  commentaire: String,
  dateCreation: {
    type: Date,
    default: Date.now
  }
});