const User = require('../models/auth')
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs') // Fixed typo: bcrybt -> bcryptjs
const { validationResult } = require('express-validator');

exports.register = async(req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ // Changed from 401 to 400
                status: 'fail',
                errors: errors.array()
            });
        }

        const user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({
                status: 'fail', // Fixed typo: fails -> fail
                message: 'User already exists' // Fixed typo: massage -> message
            });
        }
        
        const hashedPassword = await bcryptjs.hash(req.body.password, 12);
        const newUser = await User.create({
            name: req.body.user, // Map 'user' field to 'name' for consistency
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
            role: req.body.role || "sender"
        });
        
        const token = jwt.sign({_id: newUser._id}, process.env.JWT_SECRET, {
            expiresIn: '10d',
        });
        
        res.status(201).json({
            status: 'success',
            message: 'User registered successfully', // Fixed typo: registerd -> registered
            token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
                createdAt: newUser.createdAt
            }
        })
    } catch(error){
        res.status(500).json({
            status: 'error',
            message: 'Registration failed',
            error: error.message
        })
    }
}

exports.login = async(req, res) => {
    try{
        const {email, password} = req.body;
        
        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide email and password'
            });
        }
        
        const user = await User.findOne({email});
        
        if(!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({ // Changed from 403 to 401 for authentication failure
                status: 'fail',
                message: 'Invalid password'
            })
        }

        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '10d',
        });
        
        res.status(200).json({
            status: 'success',
            token,
            message: 'Logged in successfully', // Fixed typo: loged -> logged
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                createdAt: user.createdAt
            }
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Login failed',
            error: error.message
        });
    }
}

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          name: user.name, 
          email: user.email,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.user._id;

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: userId } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          status: 'fail',
          message: 'Email already exists'
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone })
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile',
      error: error.message
    });
  }
};