// This file handles the connection to Supabase (PostgreSQL database)

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl ? "✓ Found" : "✗ Missing");
console.log("Supabase Key:", supabaseKey ? "✓ Found" : "✗ Missing");

const supabase = createClient(supabaseUrl || "", supabaseKey || "");

// Function to get the Supabase client (for compatibility)
const getSupabase = () => supabase;

const connectDB = async () => {
  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials in .env file");
    return;
  }
  console.log("✅ Supabase Client Initialized");
};

module.exports = { supabase, getSupabase, connectDB };
