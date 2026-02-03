const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { supabase } = require("../config/database");

const JWT_SECRET = process.env.JWT_SECRET || "smartmess_fallback_secret";

// Middleware to get user from token
const getUserFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  try {
    const token = authHeader.replace("Bearer ", "");
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

// Create a rating
router.post("/", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(auth.replace("Bearer ", ""), JWT_SECRET);
    const { menu_id, meal_type, rating, comment } = req.body;

    const { data, error } = await supabase
      .from("ratings")
      .upsert(
        {
          student_id: decoded.id,
          menu_id,
          meal_type,
          rating,
          comment: comment || "",
        },
        { onConflict: "student_id,menu_id,meal_type" },
      )
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, rating: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get my ratings
router.get("/my-ratings", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(auth.replace("Bearer ", ""), JWT_SECRET);
    const { data } = await supabase
      .from("ratings")
      .select("*")
      .eq("student_id", decoded.id);
    res.json({ success: true, ratings: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all ratings (Admin)
router.get("/all", async (req, res) => {
  try {
    const { data } = await supabase
      .from("ratings")
      .select("*, students(name, roll_number)")
      .limit(100);
    res.json({ success: true, ratings: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get meal ratings
router.get("/meal/:menuId/:mealType", async (req, res) => {
  try {
    const { menuId, mealType } = req.params;
    const { data } = await supabase
      .from("ratings")
      .select("*, students(name)")
      .eq("menu_id", menuId)
      .eq("meal_type", mealType);
    
    const ratings = data || [];
    const avgRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
      : 0;

    res.json({ 
      success: true, 
      ratings,
      averageRating: avgRating,
      totalRatings: ratings.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a rating
router.delete("/:id", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(auth.replace("Bearer ", ""), JWT_SECRET);
    const { id } = req.params;

    // Verify the rating belongs to this user
    const { data: existing } = await supabase
      .from("ratings")
      .select("*")
      .eq("id", id)
      .eq("student_id", decoded.id)
      .single();

    if (!existing) {
      return res.status(404).json({ success: false, message: "Rating not found or unauthorized" });
    }

    const { error } = await supabase
      .from("ratings")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ success: true, message: "Rating deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a rating
router.put("/:id", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(auth.replace("Bearer ", ""), JWT_SECRET);
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Verify the rating belongs to this user
    const { data: existing } = await supabase
      .from("ratings")
      .select("*")
      .eq("id", id)
      .eq("student_id", decoded.id)
      .single();

    if (!existing) {
      return res.status(404).json({ success: false, message: "Rating not found or unauthorized" });
    }

    const { data, error } = await supabase
      .from("ratings")
      .update({ rating, comment, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, rating: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
