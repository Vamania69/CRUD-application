import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  Email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  Contact: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true,
    match: [
      /^[\+]?[\d\-\(\)\s]+$/,
      'Please enter a valid contact number'
    ]
  },
  // Additional fields for future enhancements (Issue #3)
  avatar: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Metadata for tracking (useful for Issue #3 - user activity)
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for user's full display info (useful for Issue #3)
userSchema.virtual('displayInfo').get(function() {
  return {
    id: this._id,
    name: this.Name,
    email: this.Email,
    contact: this.Contact,
    joinedDate: this.createdAt,
    isActive: this.isActive
  };
});

// Index for search functionality (prepared for Issue #3)
userSchema.index({ 
  Name: 'text', 
  Email: 'text', 
  Contact: 'text' 
});

// Pre-save middleware for data processing (prepared for Issue #2 validation)
userSchema.pre('save', function(next) {
  // Future: Add password hashing, additional validation, etc.
  next();
});

// Static methods for advanced queries (prepared for Issue #3)
userSchema.statics.searchUsers = function(searchTerm) {
  return this.find({
    $or: [
      { Name: { $regex: searchTerm, $options: 'i' } },
      { Email: { $regex: searchTerm, $options: 'i' } },
      { Contact: { $regex: searchTerm, $options: 'i' } }
    ],
    isActive: true
  });
};

userSchema.statics.getUserStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: { 
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } 
        },
        recentUsers: {
          $sum: {
            $cond: [
              { 
                $gte: ['$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] 
              }, 
              1, 
              0
            ]
          }
        }
      }
    }
  ]);
};

const User = mongoose.model('User', userSchema);

export default User;