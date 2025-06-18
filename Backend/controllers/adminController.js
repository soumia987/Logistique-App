// controllers/authController.js
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Conducteur = require('../models/Conducteur');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const authController = {
  // Inscription
  register: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { nom, prenom, email, telephone, motDePasse, role } = req.body;

      // Vérifier si l'utilisateur existe
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      // Créer l'utilisateur
      const user = await User.create({
        nom,
        prenom,
        email,
        telephone,
        motDePasse,
        role
      });

      // Si c'est un conducteur, créer le profil conducteur
      if (role === 'conducteur') {
        await Conducteur.create({
          user: user._id,
          permisConduire: req.body.permisConduire || ''
        });
      }

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Connexion
  login: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, motDePasse } = req.body;

      // Vérifier l'utilisateur
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(motDePasse))) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Profil utilisateur
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-motDePasse');
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Mise à jour profil
  updateProfile: async (req, res) => {
    try {
      const { nom, prenom, telephone } = req.body;
      
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { nom, prenom, telephone, dateModification: Date.now() },
        { new: true, select: '-motDePasse' }
      );

      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = authController;

// controllers/annonceController.js
const Annonce = require('../models/Annonce');
const Conducteur = require('../models/Conducteur');
const { validationResult } = require('express-validator');

const annonceController = {
  // Créer une annonce
  createAnnonce: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Vérifier que l'utilisateur est un conducteur
      const conducteur = await Conducteur.findOne({ user: req.user.id });
      if (!conducteur) {
        return res.status(403).json({ message: 'Seuls les conducteurs peuvent créer des annonces' });
      }

      const annonce = await Annonce.create({
        ...req.body,
        conducteur: conducteur._id
      });

      await annonce.populate('conducteur');
      
      res.status(201).json({ success: true, annonce });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Obtenir toutes les annonces
  getAnnonces: async (req, res) => {
    try {
      const { page = 1, limit = 10, lieuDepart, destinationFinale, typeMarchandise } = req.query;
      
      const filter = { statut: 'active' };
      if (lieuDepart) filter.lieuDepart = new RegExp(lieuDepart, 'i');
      if (destinationFinale) filter.destinationFinale = new RegExp(destinationFinale, 'i');
      if (typeMarchandise) filter.typeMarchandise = typeMarchandise;

      const annonces = await Annonce.find(filter)
        .populate('conducteur')
        .populate({
          path: 'conducteur',
          populate: { path: 'user', select: 'nom prenom email telephone' }
        })
        .sort({ dateCreation: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Annonce.countDocuments(filter);

      res.json({
        success: true,
        annonces,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Obtenir une annonce par ID
  getAnnonceById: async (req, res) => {
    try {
      const annonce = await Annonce.findById(req.params.id)
        .populate({
          path: 'conducteur',
          populate: { path: 'user', select: 'nom prenom email telephone' }
        });

      if (!annonce) {
        return res.status(404).json({ message: 'Annonce non trouvée' });
      }

      res.json({ success: true, annonce });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Obtenir les annonces d'un conducteur
  getMesAnnonces: async (req, res) => {
    try {
      const conducteur = await Conducteur.findOne({ user: req.user.id });
      if (!conducteur) {
        return res.status(403).json({ message: 'Profil conducteur non trouvé' });
      }

      const annonces = await Annonce.find({ conducteur: conducteur._id })
        .sort({ dateCreation: -1 });

      res.json({ success: true, annonces });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Mettre à jour une annonce
  updateAnnonce: async (req, res) => {
    try {
      const conducteur = await Conducteur.findOne({ user: req.user.id });
      if (!conducteur) {
        return res.status(403).json({ message: 'Profil conducteur non trouvé' });
      }

      const annonce = await Annonce.findOneAndUpdate(
        { _id: req.params.id, conducteur: conducteur._id },
        { ...req.body, dateModification: Date.now() },
        { new: true }
      );

      if (!annonce) {
        return res.status(404).json({ message: 'Annonce non trouvée ou non autorisée' });
      }

      res.json({ success: true, annonce });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Supprimer une annonce
  deleteAnnonce: async (req, res) => {
    try {
      const conducteur = await Conducteur.findOne({ user: req.user.id });
      if (!conducteur) {
        return res.status(403).json({ message: 'Profil conducteur non trouvé' });
      }

      const annonce = await Annonce.findOneAndDelete({
        _id: req.params.id,
        conducteur: conducteur._id
      });

      if (!annonce) {
        return res.status(404).json({ message: 'Annonce non trouvée ou non autorisée' });
      }

      res.json({ success: true, message: 'Annonce supprimée' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = annonceController;

// controllers/demandeController.js
const DemandeTransport = require('../models/DemandeTransport');
const Annonce = require('../models/Annonce');
const Conducteur = require('../models/Conducteur');
const Notification = require('../models/Notification');

const demandeController = {
  // Créer une demande
  createDemande: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Vérifier que l'annonce existe et est active
      const annonce = await Annonce.findById(req.body.annonce);
      if (!annonce || annonce.statut !== 'active') {
        return res.status(404).json({ message: 'Annonce non disponible' });
      }

      const demande = await DemandeTransport.create({
        ...req.body,
        expediteur: req.user.id
      });

      // Créer une notification pour le conducteur
      const conducteur = await Conducteur.findById(annonce.conducteur).populate('user');
      await Notification.create({
        destinataire: conducteur.user._id,
        titre: 'Nouvelle demande de transport',
        message: `Vous avez reçu une nouvelle demande pour votre trajet ${annonce.lieuDepart} - ${annonce.destinationFinale}`,
        type: 'demande_recue'
      });

      await demande.populate('annonce');
      
      res.status(201).json({ success: true, demande });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Obtenir mes demandes (expéditeur)
  getMesDemandes: async (req, res) => {
    try {
      const demandes = await DemandeTransport.find({ expediteur: req.user.id })
        .populate('annonce')
        .populate({
          path: 'annonce',
          populate: {
            path: 'conducteur',
            populate: { path: 'user', select: 'nom prenom telephone' }
          }
        })
        .sort({ dateCreation: -1 });

      res.json({ success: true, demandes });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Obtenir les demandes reçues (conducteur)
  getDemandesRecues: async (req, res) => {
    try {
      const conducteur = await Conducteur.findOne({ user: req.user.id });
      if (!conducteur) {
        return res.status(403).json({ message: 'Profil conducteur non trouvé' });
      }

      const annonces = await Annonce.find({ conducteur: conducteur._id });
      const annonceIds = annonces.map(a => a._id);

      const demandes = await DemandeTransport.find({ annonce: { $in: annonceIds } })
        .populate('expediteur', 'nom prenom email telephone')
        .populate('annonce')
        .sort({ dateCreation: -1 });

      res.json({ success: true, demandes });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Répondre à une demande (accepter/refuser)
  repondreDemande: async (req, res) => {
    try {
      const { statut } = req.body; // 'acceptee' ou 'refusee'
      
      if (!['acceptee', 'refusee'].includes(statut)) {
        return res.status(400).json({ message: 'Statut invalide' });
      }

      const demande = await DemandeTransport.findById(req.params.id)
        .populate('annonce')
        .populate('expediteur');

      if (!demande) {
        return res.status(404).json({ message: 'Demande non trouvée' });
      }

      // Vérifier que l'utilisateur est le conducteur de l'annonce
      const conducteur = await Conducteur.findOne({ user: req.user.id });
      if (!conducteur || demande.annonce.conducteur.toString() !== conducteur._id.toString()) {
        return res.status(403).json({ message: 'Non autorisé' });
      }

      demande.statut = statut;
      demande.dateModification = Date.now();
      await demande.save();

      // Créer une notification pour l'expéditeur
      await Notification.create({
        destinataire: demande.expediteur._id,
        titre: `Demande ${statut === 'acceptee' ? 'acceptée' : 'refusée'}`,
        message: `Votre demande pour le trajet ${demande.annonce.lieuDepart} - ${demande.annonce.destinationFinale} a été ${statut === 'acceptee' ? 'acceptée' : 'refusée'}`,
        type: statut === 'acceptee' ? 'demande_acceptee' : 'demande_refusee'
      });

      res.json({ success: true, demande });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Marquer comme livré
  marquerLivree: async (req, res) => {
    try {
      const demande = await DemandeTransport.findByIdAndUpdate(
        req.params.id,
        { statut: 'livree', dateModification: Date.now() },
        { new: true }
      ).populate('expediteur').populate('annonce');

      if (!demande) {
        return res.status(404).json({ message: 'Demande non trouvée' });
      }

      // Créer une notification
      await Notification.create({
        destinataire: demande.expediteur._id,
        titre: 'Livraison confirmée',
        message: `Votre colis a été livré avec succès`,
        type: 'livraison_confirmee'
      });

      res.json({ success: true, demande });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = demandeController;