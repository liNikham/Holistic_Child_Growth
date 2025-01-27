const ChildProfile = require('../models/childProfile');
const mongoose = require('mongoose');
// Create a child profile linked to the logged-in parent
exports.createChildProfile = async (req, res) => {
    console.log("in create child profile")
  try {
    const { name, dateOfBirth, gender } = req.body;
    const parentId = req.user; // Extracted from the logged-in parent's token
    const childProfile = new ChildProfile({ name, dateOfBirth, gender, parentId });
   
    const savedChild = await childProfile.save().catch((error) => {
  console.error("Save failed:", error);
  throw error;
}); 
    console.log(parentId)
    res.status(201).json(savedChild);
  } catch (err) {
    res.status(500).json({ message: 'Error creating child profile', error: err.message });
  }
};

// Get all child profiles for the logged-in parent
exports.getAllChildProfiles = async (req, res) => {
  try {
    const parentId = req.user; // Extracted from the logged-in parent's token
    const children = await ChildProfile.find({ parentId });
    console.log("hello")
    console.log(children);
    res.status(200).json(children);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching child profiles', error: err.message });
  }
};
