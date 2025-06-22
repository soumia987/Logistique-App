const Annonce = require('../models/Annonce');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Create new annonce
// @route   POST /api/annonces
// @access  Private (Conducteur)
exports.createAnnonce = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if user is a conducteur
    if (req.user.role !== 'conducteur') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les conducteurs peuvent créer des annonces'
      });
    }

    const annonceData = {
      ...req.body,
      conducteur: req.user._id
    };

    const annonce = await Annonce.create(annonceData);

    // Populate conducteur info
    await annonce.populate('conducteur', 'nom prenom email telephone');

    res.status(201).json({
      success: true,
      message: 'Annonce créée avec succès',
      annonce
    });
  } catch (error) {
    console.error('Create annonce error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'annonce',
      error: error.message
    });
  }
};

// @desc    Get all annonces with filters
// @route   GET /api/annonces
// @access  Public
exports.getAnnonces = async (req, res) => {
  try {
    const {
      lieuDepart,
      destinationFinale,
      dateDepart,
      typeMarchandise,
      page = 1,
      limit = 10,
      sort = '-dateCreation'
    } = req.query;

    // Build filter object
    const filter = { statut: 'active' };
    
    if (lieuDepart) {
      filter.lieuDepart = { $regex: lieuDepart, $options: 'i' };
    }
    
    if (destinationFinale) {
      filter.destinationFinale = { $regex: destinationFinale, $options: 'i' };
    }
    
    if (dateDepart) {
      const startDate = new Date(dateDepart);
      const endDate = new Date(dateDepart);
      endDate.setDate(endDate.getDate() + 1);
      filter.dateDepart = { $gte: startDate, $lt: endDate };
    }
    
    if (typeMarchandise) {
      filter.typeMarchandise = typeMarchandise;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const annonces = await Annonce.find(filter)
      .populate('conducteur', 'nom prenom email telephone isVerified')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Annonce.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: annonces.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      annonces
    });
  } catch (error) {
    console.error('Get annonces error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des annonces',
      error: error.message
    });
  }
};

// @desc    Get single annonce
// @route   GET /api/annonces/:id
// @access  Public
exports.getAnnonce = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id)
      .populate('conducteur', 'nom prenom email telephone isVerified');

    if (!annonce) {
      return res.status(404).json({
        success: false,
        message: 'Annonce non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      annonce
    });
  } catch (error) {
    console.error('Get annonce error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'annonce',
      error: error.message
    });
  }
};

// @desc    Update annonce
// @route   PUT /api/annonces/:id
// @access  Private (Conducteur - owner)
exports.updateAnnonce = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);

    if (!annonce) {
      return res.status(404).json({
        success: false,
        message: 'Annonce non trouvée'
      });
    }

    // Check if user is the owner
    if (annonce.conducteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à modifier cette annonce'
      });
    }

    const updatedAnnonce = await Annonce.findByIdAndUpdate(
      req.params.id,
      { ...req.body, dateModification: Date.now() },
      { new: true, runValidators: true }
    ).populate('conducteur', 'nom prenom email telephone');

    res.status(200).json({
      success: true,
      message: 'Annonce mise à jour avec succès',
      annonce: updatedAnnonce
    });
  } catch (error) {
    console.error('Update annonce error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'annonce',
      error: error.message
    });
  }
};

// @desc    Delete annonce
// @route   DELETE /api/annonces/:id
// @access  Private (Conducteur - owner or Admin)
exports.deleteAnnonce = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);

    if (!annonce) {
      return res.status(404).json({
        success: false,
        message: 'Annonce non trouvée'
      });
    }

    // Check if user is the owner or admin
    if (annonce.conducteur.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à supprimer cette annonce'
      });
    }

    await Annonce.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Annonce supprimée avec succès'
    });
  } catch (error) {
    console.error('Delete annonce error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'annonce',
      error: error.message
    });
  }
};

// @desc    Get user's annonces
// @route   GET /api/annonces/my-annonces
// @access  Private (Conducteur)
exports.getMyAnnonces = async (req, res) => {
  try {
    const annonces = await Annonce.find({ conducteur: req.user._id })
      .populate('conducteur', 'nom prenom email telephone')
      .sort('-dateCreation');

    res.status(200).json({
      success: true,
      count: annonces.length,
      annonces
    });
  } catch (error) {
    console.error('Get my annonces error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de vos annonces',
      error: error.message
    });
  }
};

// @desc    Update annonce status
// @route   PATCH /api/annonces/:id/status
// @access  Private (Conducteur - owner)
exports.updateAnnonceStatus = async (req, res) => {
  try {
    const { statut } = req.body;

    if (!['active', 'complete', 'annulee'].includes(statut)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    const annonce = await Annonce.findById(req.params.id);

    if (!annonce) {
      return res.status(404).json({
        success: false,
        message: 'Annonce non trouvée'
      });
    }

    // Check if user is the owner
    if (annonce.conducteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à modifier cette annonce'
      });
    }

    annonce.statut = statut;
    annonce.dateModification = Date.now();
    await annonce.save();

    res.status(200).json({
      success: true,
      message: 'Statut de l\'annonce mis à jour avec succès',
      annonce
    });
  } catch (error) {
    console.error('Update annonce status error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message
    });
  }
}; 