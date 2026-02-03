// Admin Model - Defines the structure of admin data in database

const mongoose = require('mongoose');

// Create a Schema for Admin
const adminSchema = new mongoose.Schema({
  
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  email: {
    type: String,
    required: true,
    unique: true,          // Only one admin with this email
    lowercase: true
  },
  
  password: {
    type: String,
    required: true         // For admin login
  },
  
  role: {
    type: String,
    enum: ['admin', 'superadmin'],  // Can only be these two values
    default: 'admin'                 // Normal admin by default
  },
  
  phoneNumber: {
    type: String,
    required: true
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  }
  
}, {
  timestamps: true       // Adds createdAt and updatedAt
});

// Create and export the Admin model
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
