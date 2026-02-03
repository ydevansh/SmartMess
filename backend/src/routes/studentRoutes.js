// Student Routes - Define URL endpoints for student operations

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "smartmess_fallback_secret";

// Import controller functions
const {
  getTodaysMenu,
  getMenuByDate,
  getWeeklyMenu,
  submitRating,
  submitComplaint,
  getMyComplaints
} = require('../controllers/studentController');

// Auth middleware to get user from token
const authMiddleware = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// ============================================
// MENU ROUTES
// ============================================

// GET /api/student/menu/today - Get today's menu
// No parameters needed
router.get('/menu/today', getTodaysMenu);

// GET /api/student/menu?date=2026-02-03 - Get menu by specific date
// Query parameter: date (YYYY-MM-DD format)
router.get('/menu', getMenuByDate);

// GET /api/student/menu/weekly - Get menu for next 7 days
// No parameters needed
router.get('/menu/weekly', getWeeklyMenu);

// ============================================
// RATING ROUTES
// ============================================

// POST /api/student/rating - Submit a rating for a meal
// Request body:
// {
//   "studentId": "uuid-here",
//   "menuId": "uuid-here",
//   "mealType": "breakfast",  // or lunch, snacks, dinner
//   "rating": 4,              // 1 to 5
//   "comment": "Good food"    // optional
// }
router.post('/rating', submitRating);

// ============================================
// COMPLAINT ROUTES (for /api/student/...)
// ============================================

// POST /api/student/complaint - Submit a complaint (legacy)
router.post('/complaint', authMiddleware, submitComplaint);

// GET /api/student/complaints/:studentId - Get all complaints by a student (legacy)
router.get('/complaints/:studentId', getMyComplaints);

// ============================================
// COMPLAINT ROUTES (for /api/complaints/... alias)
// ============================================

// POST /api/complaints - Submit a new complaint (frontend expects this)
router.post('/', authMiddleware, submitComplaint);

// GET /api/complaints/my-complaints - Get logged-in user's complaints
router.get('/my-complaints', authMiddleware, async (req, res) => {
  // Call getMyComplaints with the user id from token
  req.params.studentId = req.user.id;
  return getMyComplaints(req, res);
});

// GET /api/complaints/:id - Get a specific complaint
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { getSupabase } = require('../config/database');
    const supabase = getSupabase();
    
    const { data: complaint, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error || !complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    
    res.json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Export the router
module.exports = router;
