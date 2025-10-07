import User from '../models/User.js';

// Get all users with optional pagination and search (prepared for Issue #3)
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query = { isActive: true };
    
    // Search functionality (prepared for Issue #3)
    if (search) {
      query = {
        ...query,
        $or: [
          { Name: { $regex: search, $options: 'i' } },
          { Email: { $regex: search, $options: 'i' } },
          { Contact: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { Name, Email, Contact } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ Email: Email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const user = new User({
      Name: Name.trim(),
      Email: Email.toLowerCase().trim(),
      Contact: Contact.trim()
    });

    const savedUser = await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: savedUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get single user by ID
export const singleUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-__v');
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Email, Contact } = req.body;

    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser || !existingUser.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and if new email already exists
    if (Email && Email.toLowerCase() !== existingUser.Email) {
      const emailExists = await User.findOne({ 
        Email: Email.toLowerCase(),
        _id: { $ne: id }
      });
      
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    const updateData = {};
    if (Name) updateData.Name = Name.trim();
    if (Email) updateData.Email = Email.toLowerCase().trim();
    if (Contact) updateData.Contact = Contact.trim();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true,
        select: '-__v'
      }
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Soft delete user (mark as inactive)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - mark as inactive instead of removing
    await User.findByIdAndUpdate(id, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get user statistics (prepared for Issue #3 - dashboard)
export const getUserStats = async (req, res) => {
  try {
    const stats = await User.getUserStats();
    
    res.status(200).json({
      success: true,
      data: stats[0] || {
        totalUsers: 0,
        activeUsers: 0,
        recentUsers: 0
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
