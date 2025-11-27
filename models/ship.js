const mongoose = require('mongoose');

const shipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ship name is required'],
    trim: true,
    minlength: [2, 'Ship name must be at least 2 characters'],
    maxlength: [100, 'Ship name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Creator email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [0, 'Capacity cannot be negative']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be 1900 or later'],
    max: [new Date().getFullYear() , 'Year cannot be more than present year']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
shipSchema.pre('save', function () {
  this.updatedAt = Date.now();
});
// Index for faster queries
shipSchema.index({ name: 1, email: 1 });

module.exports = mongoose.model('Ship', shipSchema);
