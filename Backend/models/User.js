// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  prenom: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  telephone: {
    type: String,
    required: true
  },
  motDePasse: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['conducteur', 'expediteur', 'admin'],
    default: 'expediteur'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  photo: String,
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateModification: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('motDePasse')) return next();
  this.motDePasse = await bcrypt.hash(this.motDePasse, 12);
  this.dateModification = Date.now();
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.motDePasse);
};

module.exports = mongoose.model('User', userSchema);











