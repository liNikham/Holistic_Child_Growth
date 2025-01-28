const ChildProfile = require('../models/childProfile.model');
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
exports.addActivity = async (req, res) => {
  const { childId, activity, duration, date } = req.body;

  try {
    // Find the child profile
    const childProfile = await ChildProfile.findOne({ _id: childId });

    if (!childProfile) {
      return res.status(404).json({ message: 'Child profile not found' });
    }

    // Add the new activity
    childProfile.activities.push({
      activity,
      category: '', // You can add a category if needed
      duration,
      date: new Date(date),
      notes: '', // Optional notes if needed
    });

    await childProfile.save();
    res.status(201).json({ message: 'Activity added successfully', childProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Get activities for a specific child profile
exports.getActivitiesByChildId = async (req, res) => {
  const { childId } = req.params; // Get the childId from the route parameter

  try {
    // Find the child profile by ID
    const childProfile = await ChildProfile.findOne({ _id: childId });

    if (!childProfile) {
      return res.status(404).json({ message: 'Child profile not found' });
    }

    // Send the activities back in the response
    res.status(200).json({ activities: childProfile.activities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
};
