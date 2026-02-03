// Menu Model - Defines the structure of daily mess menu

const mongoose = require('mongoose');

// Create a Schema for Menu
const menuSchema = new mongoose.Schema({
  
  // Date for this menu
  date: {
    type: Date,
    required: true
  },
  
  // Day of the week (Monday, Tuesday, etc.)
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  
  // Breakfast Menu
  breakfast: {
    items: [{
      type: String        // Array of food items: ["Poha", "Tea", "Banana"]
    }],
    timing: {
      type: String,
      default: "7:00 AM - 9:00 AM"
    }
  },
  
  // Lunch Menu
  lunch: {
    items: [{
      type: String        // ["Dal", "Rice", "Roti", "Sabji"]
    }],
    timing: {
      type: String,
      default: "12:00 PM - 2:00 PM"
    }
  },
  
  // Snacks Menu (Optional)
  snacks: {
    items: [{
      type: String        // ["Samosa", "Tea"]
    }],
    timing: {
      type: String,
      default: "4:00 PM - 5:00 PM"
    }
  },
  
  // Dinner Menu
  dinner: {
    items: [{
      type: String        // ["Dal", "Rice", "Roti", "Paneer"]
    }],
    timing: {
      type: String,
      default: "7:00 PM - 9:00 PM"
    }
  },
  
  // Who added this menu
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to Admin model
    ref: 'Admin',                          // Links to Admin collection
    required: true
  },
  
  // Special notes (Optional)
  specialNote: {
    type: String,
    default: ""          // "Today's special: Gulab Jamun"
  }
  
}, {
  timestamps: true       // Adds createdAt and updatedAt
});

// Create and export the Menu model
const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;
