const Trajet = require('../models/TrajetModel');
const { validationResult } = require('express-validator');

exports.createTrajet = async (req, res) => {
  try {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      departureLocation,
      stops,
      destination,
      departureDate,
      goodsType,
      maxDimensions,
      maxWeight,
      availableCapacity
    } = req.body;

    const trajet = new Trajet({
      driver: req.user._id, // from auth middleware
      departureLocation,
      stops,
      destination,
      departureDate,
      goodsType,
      maxDimensions,
      maxWeight,
      availableCapacity
    });

    await trajet.save();
    res.status(201).json({ status: 'success', data: trajet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server Error' });
  }
};

exports.getAllTrajets = async (req, res) => {
  try {
    const { destination, date } = req.query;

    const query = {};
    if (destination) query.destination = destination;
    if (date) query.departureDate = { $gte: new Date(date) };

    const trajets = await Trajet.find(query).populate('driver', 'name email');
    res.status(200).json({ status: 'success', data: trajets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server Error' });
  }
};

exports.getTrajetById = async (req, res) => {
  try {
    const trajet = await Trajet.findById(req.params.id).populate('driver', 'name email');
    if (!trajet) {
      return res.status(404).json({ status: 'fail', message: 'Trip not found' });
    }
    res.status(200).json({ status: 'success', data: trajet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server Error' });
  }
};

exports.getMyTrajets = async (req, res) => {
  try {
    // Get the current user's ID from the auth middleware
    const driverId = req.user._id;
    
    const trajets = await Trajet.find({ driver: driverId })
      .populate('driver', 'name email')
      .sort({ departureDate: -1 }); // Sort by most recent first
    
    res.status(200).json({ 
      status: 'success', 
      count: trajets.length,
      data: trajets 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server Error' 
    });
  }
};

exports.deleteTrajet = async (req, res) => {
  try {
    const trajet = await Trajet.findById(req.params.id);

    if (!trajet) {
      return res.status(404).json({ status: 'fail', message: 'Trip not found' });
    }

    // Driver or admin can delete
    if (
      trajet.driver.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ status: 'fail', message: 'Unauthorized' });
    }

    await trajet.deleteOne();
    res.status(200).json({ status: 'success', message: 'Trip deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server Error' });
  }
};
