const DemandeTransport = require('../models/Demande');
const Annonce = require('../models/Annonce');
const User = require('../models/User');
const { sendNotificationEmail } = require('../config/email');
const { validationResult } = require('express-validator');

// @desc    Create new demande
// @route   POST /api/demandes
// @access  Private (Expéditeur)
exports.createDemande = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if user is an expediteur
    if (req.user.role !== 'expediteur') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les expéditeurs peuvent créer des demandes'
      });
    }

    const { annonceId } = req.body;

    // Check if annonce exists and is active
    const annonce = await Annonce.findById(annonceId);
    if (!annonce) {
      return res.status(404).json({
        success: false,
        message: 'Annonce non trouvée'
      });
    }

    if (annonce.statut !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cette annonce n\'est plus disponible'
      });
    }

    // Check if user already has a pending demande for this annonce
    const existingDemande = await DemandeTransport.findOne({
      expediteur: req.user._id,
      annonce: annonceId,
      statut: { $in: ['en_attente', 'acceptee'] }
    });

    if (existingDemande) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà une demande en cours pour cette annonce'
      });
    }

    const demandeData = {
      ...req.body,
      expediteur: req.user._id,
      annonce: annonceId
    };

    const demande = await DemandeTransport.create(demandeData);

    // Populate related data
    await demande.populate([
      { path: 'expediteur', select: 'nom prenom email telephone' },
      { path: 'annonce', populate: { path: 'conducteur', select: 'nom prenom email telephone' } }
    ]);

    // Send notification email to conducteur
    try {
      await sendNotificationEmail(
        annonce.conducteur.email,
        'new_demande',
        {
          colisDetails: `${demande.detailsColis.type} - ${demande.detailsColis.poids}kg`,
          expediteurContact: `${demande.expediteur.nom} ${demande.expediteur.prenom} - ${demande.expediteur.telephone}`
        }
      );
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Demande créée avec succès',
      demande
    });
  } catch (error) {
    console.error('Create demande error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la demande',
      error: error.message
    });
  }
};

// @desc    Get all demandes for a conducteur
// @route   GET /api/demandes/received
// @access  Private (Conducteur)
exports.getReceivedDemandes = async (req, res) => {
  try {
    // Check if user is a conducteur
    if (req.user.role !== 'conducteur') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    const demandes = await DemandeTransport.find({
      'annonce.conducteur': req.user._id
    })
    .populate([
      { path: 'expediteur', select: 'nom prenom email telephone' },
      { path: 'annonce', populate: { path: 'conducteur', select: 'nom prenom email telephone' } }
    ])
    .sort('-dateCreation');

    res.status(200).json({
      success: true,
      count: demandes.length,
      demandes
    });
  } catch (error) {
    console.error('Get received demandes error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des demandes reçues',
      error: error.message
    });
  }
};

// @desc    Get user's sent demandes
// @route   GET /api/demandes/sent
// @access  Private (Expéditeur)
exports.getSentDemandes = async (req, res) => {
  try {
    // Check if user is an expediteur
    if (req.user.role !== 'expediteur') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    const demandes = await DemandeTransport.find({
      expediteur: req.user._id
    })
    .populate([
      { path: 'expediteur', select: 'nom prenom email telephone' },
      { path: 'annonce', populate: { path: 'conducteur', select: 'nom prenom email telephone' } }
    ])
    .sort('-dateCreation');

    res.status(200).json({
      success: true,
      count: demandes.length,
      demandes
    });
  } catch (error) {
    console.error('Get sent demandes error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de vos demandes',
      error: error.message
    });
  }
};

// @desc    Accept or reject demande
// @route   PATCH /api/demandes/:id/status
// @access  Private (Conducteur - owner of annonce)
exports.updateDemandeStatus = async (req, res) => {
  try {
    const { statut, raison } = req.body;

    if (!['acceptee', 'refusee'].includes(statut)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    const demande = await DemandeTransport.findById(req.params.id)
      .populate([
        { path: 'expediteur', select: 'nom prenom email telephone' },
        { path: 'annonce', populate: { path: 'conducteur', select: 'nom prenom email telephone' } }
      ]);

    if (!demande) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée'
      });
    }

    // Check if user is the conducteur of the annonce
    if (demande.annonce.conducteur._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à modifier cette demande'
      });
    }

    // Check if demande is still pending
    if (demande.statut !== 'en_attente') {
      return res.status(400).json({
        success: false,
        message: 'Cette demande ne peut plus être modifiée'
      });
    }

    demande.statut = statut;
    demande.dateModification = Date.now();
    await demande.save();

    // Send notification email to expediteur
    try {
      await sendNotificationEmail(
        demande.expediteur.email,
        statut === 'acceptee' ? 'demande_accepted' : 'demande_refused',
        {
          trajetDetails: `${demande.annonce.lieuDepart} → ${demande.annonce.destinationFinale}`,
          conducteurContact: `${demande.annonce.conducteur.nom} ${demande.annonce.conducteur.prenom} - ${demande.annonce.conducteur.telephone}`,
          reason: raison
        }
      );
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

    res.status(200).json({
      success: true,
      message: `Demande ${statut === 'acceptee' ? 'acceptée' : 'refusée'} avec succès`,
      demande
    });
  } catch (error) {
    console.error('Update demande status error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message
    });
  }
};

// @desc    Get single demande
// @route   GET /api/demandes/:id
// @access  Private
exports.getDemande = async (req, res) => {
  try {
    const demande = await DemandeTransport.findById(req.params.id)
      .populate([
        { path: 'expediteur', select: 'nom prenom email telephone' },
        { path: 'annonce', populate: { path: 'conducteur', select: 'nom prenom email telephone' } }
      ]);

    if (!demande) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée'
      });
    }

    // Check if user has access to this demande
    const isOwner = demande.expediteur._id.toString() === req.user._id.toString();
    const isConducteur = demande.annonce.conducteur._id.toString() === req.user._id.toString();

    if (!isOwner && !isConducteur && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    res.status(200).json({
      success: true,
      demande
    });
  } catch (error) {
    console.error('Get demande error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la demande',
      error: error.message
    });
  }
};

// @desc    Update demande (expediteur only)
// @route   PUT /api/demandes/:id
// @access  Private (Expéditeur - owner)
exports.updateDemande = async (req, res) => {
  try {
    const demande = await DemandeTransport.findById(req.params.id);

    if (!demande) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée'
      });
    }

    // Check if user is the owner and demande is still pending
    if (demande.expediteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à modifier cette demande'
      });
    }

    if (demande.statut !== 'en_attente') {
      return res.status(400).json({
        success: false,
        message: 'Cette demande ne peut plus être modifiée'
      });
    }

    const updatedDemande = await DemandeTransport.findByIdAndUpdate(
      req.params.id,
      { ...req.body, dateModification: Date.now() },
      { new: true, runValidators: true }
    ).populate([
      { path: 'expediteur', select: 'nom prenom email telephone' },
      { path: 'annonce', populate: { path: 'conducteur', select: 'nom prenom email telephone' } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Demande mise à jour avec succès',
      demande: updatedDemande
    });
  } catch (error) {
    console.error('Update demande error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la demande',
      error: error.message
    });
  }
}; 