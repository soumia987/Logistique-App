const Evaluation = require('../models/Evaluation');
const DemandeTransport = require('../models/Demande');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Create new evaluation
// @route   POST /api/evaluations
// @access  Private
exports.createEvaluation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { demandeTransportId, evalueId, note, commentaire } = req.body;

    // Check if demande exists and is completed
    const demande = await DemandeTransport.findById(demandeTransportId);
    if (!demande) {
      return res.status(404).json({
        success: false,
        message: 'Demande de transport non trouvée'
      });
    }

    if (demande.statut !== 'livree') {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez évaluer que les livraisons terminées'
      });
    }

    // Check if user is involved in this demande
    const isExpediteur = demande.expediteur.toString() === req.user._id.toString();
    const isConducteur = demande.annonce.conducteur.toString() === req.user._id.toString();

    if (!isExpediteur && !isConducteur) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à évaluer cette demande'
      });
    }

    // Check if user is evaluating the correct person
    const correctEvalueId = isExpediteur ? demande.annonce.conducteur : demande.expediteur;
    if (evalueId !== correctEvalueId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez évaluer que l\'autre partie de la transaction'
      });
    }

    // Check if evaluation already exists
    const existingEvaluation = await Evaluation.findOne({
      evaluateur: req.user._id,
      demandeTransport: demandeTransportId
    });

    if (existingEvaluation) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà évalué cette demande'
      });
    }

    const evaluation = await Evaluation.create({
      evaluateur: req.user._id,
      evalue: evalueId,
      demandeTransport: demandeTransportId,
      note,
      commentaire
    });

    // Populate related data
    await evaluation.populate([
      { path: 'evaluateur', select: 'nom prenom' },
      { path: 'evalue', select: 'nom prenom' },
      { path: 'demandeTransport', populate: { path: 'annonce', select: 'lieuDepart destinationFinale' } }
    ]);

    res.status(201).json({
      success: true,
      message: 'Évaluation créée avec succès',
      evaluation
    });
  } catch (error) {
    console.error('Create evaluation error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'évaluation',
      error: error.message
    });
  }
};

// @desc    Get evaluations for a user
// @route   GET /api/evaluations/user/:userId
// @access  Public
exports.getUserEvaluations = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    const skip = (page - 1) * limit;

    const evaluations = await Evaluation.find({ evalue: userId })
      .populate([
        { path: 'evaluateur', select: 'nom prenom' },
        { path: 'evalue', select: 'nom prenom' },
        { path: 'demandeTransport', populate: { path: 'annonce', select: 'lieuDepart destinationFinale' } }
      ])
      .sort('-dateCreation')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Evaluation.countDocuments({ evalue: userId });

    // Calculate average rating
    const avgRating = await Evaluation.aggregate([
      { $match: { evalue: user._id } },
      { $group: { _id: null, avgRating: { $avg: '$note' } } }
    ]);

    res.status(200).json({
      success: true,
      count: evaluations.length,
      total,
      averageRating: avgRating.length > 0 ? avgRating[0].avgRating : 0,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      evaluations
    });
  } catch (error) {
    console.error('Get user evaluations error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des évaluations',
      error: error.message
    });
  }
};

// @desc    Get user's sent evaluations
// @route   GET /api/evaluations/sent
// @access  Private
exports.getSentEvaluations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const evaluations = await Evaluation.find({ evaluateur: req.user._id })
      .populate([
        { path: 'evaluateur', select: 'nom prenom' },
        { path: 'evalue', select: 'nom prenom' },
        { path: 'demandeTransport', populate: { path: 'annonce', select: 'lieuDepart destinationFinale' } }
      ])
      .sort('-dateCreation')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Evaluation.countDocuments({ evaluateur: req.user._id });

    res.status(200).json({
      success: true,
      count: evaluations.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      evaluations
    });
  } catch (error) {
    console.error('Get sent evaluations error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de vos évaluations',
      error: error.message
    });
  }
};

// @desc    Get single evaluation
// @route   GET /api/evaluations/:id
// @access  Public
exports.getEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id)
      .populate([
        { path: 'evaluateur', select: 'nom prenom' },
        { path: 'evalue', select: 'nom prenom' },
        { path: 'demandeTransport', populate: { path: 'annonce', select: 'lieuDepart destinationFinale' } }
      ]);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Évaluation non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      evaluation
    });
  } catch (error) {
    console.error('Get evaluation error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'évaluation',
      error: error.message
    });
  }
};

// @desc    Update evaluation
// @route   PUT /api/evaluations/:id
// @access  Private (Owner)
exports.updateEvaluation = async (req, res) => {
  try {
    const { note, commentaire } = req.body;

    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Évaluation non trouvée'
      });
    }

    // Check if user is the owner
    if (evaluation.evaluateur.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à modifier cette évaluation'
      });
    }

    // Check if evaluation is recent (within 24 hours)
    const hoursSinceCreation = (Date.now() - evaluation.dateCreation.getTime()) / (1000 * 60 * 60);
    if (hoursSinceCreation > 24) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez modifier une évaluation que dans les 24 heures suivant sa création'
      });
    }

    const updatedEvaluation = await Evaluation.findByIdAndUpdate(
      req.params.id,
      { note, commentaire },
      { new: true, runValidators: true }
    ).populate([
      { path: 'evaluateur', select: 'nom prenom' },
      { path: 'evalue', select: 'nom prenom' },
      { path: 'demandeTransport', populate: { path: 'annonce', select: 'lieuDepart destinationFinale' } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Évaluation mise à jour avec succès',
      evaluation: updatedEvaluation
    });
  } catch (error) {
    console.error('Update evaluation error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'évaluation',
      error: error.message
    });
  }
};

// @desc    Delete evaluation
// @route   DELETE /api/evaluations/:id
// @access  Private (Owner or Admin)
exports.deleteEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Évaluation non trouvée'
      });
    }

    // Check if user is the owner or admin
    if (evaluation.evaluateur.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à supprimer cette évaluation'
      });
    }

    await Evaluation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Évaluation supprimée avec succès'
    });
  } catch (error) {
    console.error('Delete evaluation error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'évaluation',
      error: error.message
    });
  }
}; 