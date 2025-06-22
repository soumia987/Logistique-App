const User = require('../models/User');
const Annonce = require('../models/Annonce');
const DemandeTransport = require('../models/Demande');
const Evaluation = require('../models/Evaluation');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalAnnonces = await Annonce.countDocuments();
    const totalDemandes = await DemandeTransport.countDocuments();
    const totalEvaluations = await Evaluation.countDocuments();

    // Get users by role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Get annonces by status
    const annoncesByStatus = await Annonce.aggregate([
      { $group: { _id: '$statut', count: { $sum: 1 } } }
    ]);

    // Get demandes by status
    const demandesByStatus = await DemandeTransport.aggregate([
      { $group: { _id: '$statut', count: { $sum: 1 } } }
    ]);

    // Get recent activities
    const recentUsers = await User.find()
      .sort('-dateCreation')
      .limit(5)
      .select('nom prenom email role dateCreation');

    const recentAnnonces = await Annonce.find()
      .populate('conducteur', 'nom prenom')
      .sort('-dateCreation')
      .limit(5)
      .select('lieuDepart destinationFinale statut dateCreation');

    const recentDemandes = await DemandeTransport.find()
      .populate([
        { path: 'expediteur', select: 'nom prenom' },
        { path: 'annonce', select: 'lieuDepart destinationFinale' }
      ])
      .sort('-dateCreation')
      .limit(5)
      .select('statut dateCreation');

    // Calculate acceptance rate
    const totalAcceptedDemandes = await DemandeTransport.countDocuments({ statut: 'acceptee' });
    const totalPendingDemandes = await DemandeTransport.countDocuments({ statut: 'en_attente' });
    const acceptanceRate = totalDemandes > 0 ? (totalAcceptedDemandes / totalDemandes) * 100 : 0;

    // Get monthly statistics for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Annonce.aggregate([
      { $match: { dateCreation: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$dateCreation' },
            month: { $month: '$dateCreation' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAnnonces,
        totalDemandes,
        totalEvaluations,
        acceptanceRate: Math.round(acceptanceRate * 100) / 100,
        usersByRole,
        annoncesByStatus,
        demandesByStatus,
        recentUsers,
        recentAnnonces,
        recentDemandes,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

// @desc    Get all users with pagination and filters
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    const { page = 1, limit = 10, role, search, sort = '-dateCreation' } = req.query;

    // Build filter
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { prenom: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select('-motDePasse')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message
    });
  }
};

// @desc    Update user verification status
// @route   PATCH /api/admin/users/:id/verify
// @access  Private (Admin)
exports.verifyUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    const { isVerified } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true, runValidators: true }
    ).select('-motDePasse');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: `Utilisateur ${isVerified ? 'vérifié' : 'non vérifié'} avec succès`,
      user
    });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification de l\'utilisateur',
      error: error.message
    });
  }
};

// @desc    Suspend/activate user
// @route   PATCH /api/admin/users/:id/suspend
// @access  Private (Admin)
exports.suspendUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    const { isSuspended } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isSuspended },
      { new: true, runValidators: true }
    ).select('-motDePasse');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: `Utilisateur ${isSuspended ? 'suspendu' : 'activé'} avec succès`,
      user
    });
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suspension de l\'utilisateur',
      error: error.message
    });
  }
};

// @desc    Get all annonces with admin filters
// @route   GET /api/admin/annonces
// @access  Private (Admin)
exports.getAdminAnnonces = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    const { page = 1, limit = 10, statut, search, sort = '-dateCreation' } = req.query;

    // Build filter
    const filter = {};
    if (statut) filter.statut = statut;
    if (search) {
      filter.$or = [
        { lieuDepart: { $regex: search, $options: 'i' } },
        { destinationFinale: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const annonces = await Annonce.find(filter)
      .populate('conducteur', 'nom prenom email telephone')
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
    console.error('Get admin annonces error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des annonces',
      error: error.message
    });
  }
};

// @desc    Delete annonce (admin)
// @route   DELETE /api/admin/annonces/:id
// @access  Private (Admin)
exports.deleteAnnonce = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    const annonce = await Annonce.findByIdAndDelete(req.params.id);

    if (!annonce) {
      return res.status(404).json({
        success: false,
        message: 'Annonce non trouvée'
      });
    }

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

// @desc    Get all demandes with admin filters
// @route   GET /api/admin/demandes
// @access  Private (Admin)
exports.getAdminDemandes = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    const { page = 1, limit = 10, statut, sort = '-dateCreation' } = req.query;

    // Build filter
    const filter = {};
    if (statut) filter.statut = statut;

    const skip = (page - 1) * limit;

    const demandes = await DemandeTransport.find(filter)
      .populate([
        { path: 'expediteur', select: 'nom prenom email telephone' },
        { path: 'annonce', populate: { path: 'conducteur', select: 'nom prenom email telephone' } }
      ])
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await DemandeTransport.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: demandes.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      demandes
    });
  } catch (error) {
    console.error('Get admin demandes error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des demandes',
      error: error.message
    });
  }
}; 