const ChildProfile = require('../models/childProfile.model');
const mongoose = require('mongoose');
const geminiService = require('../utils/geminiService')
const MonthlySummary = require('../models/monthlySummary.model')
const { uploadSummaryToS3 } = require('../utils/s3Config')
const ChildJournal = require('../models/childJournal.model');
// Create a child profile linked to the logged-in parent

exports.createChildProfile = async (req, res) => {
  try {
    const { name, dateOfBirth, gender, height, weight } = req.body;
    const parentId = req.user; // Extracted from the logged-in parent's token
    const childProfile = new ChildProfile({ name, dateOfBirth, gender, parentId, height, weight });

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
    res.status(200).json(children);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching child profiles', error: err.message });
  }
};
exports.addActivity = async (req, res) => {
  try {
    const { childId, activity, duration, date } = req.body;
    console.log('Received activity data:', { childId, activity, duration, date });

    // Validate required fields
    if (!childId || !activity || !duration || !date) {
      console.log('Missing required fields:', { childId, activity, duration, date });
      return res.status(400).json({
        message: 'Missing required fields: childId, activity, duration, and date are required',
        received: { childId, activity, duration, date }
      });
    }

    // Find the child profile
    const childProfile = await ChildProfile.findById(childId);
    console.log('Found child profile:', childProfile ? 'yes' : 'no');

    if (!childProfile) {
      return res.status(404).json({
        message: 'Child profile not found',
        childId
      });
    }

    // Create new activity with _id
    const newActivity = {
      _id: new mongoose.Types.ObjectId(),
      activity,
      duration: Number(duration),
      date: new Date(date),
      category: '',
      notes: ''
    };

    // Use $push operator to add the activity
    const updatedChild = await ChildProfile.findByIdAndUpdate(
      childId,
      { $push: { activities: newActivity } },
      {
        new: true,
        runValidators: false
      }
    );

    if (!updatedChild) {
      return res.status(404).json({
        message: 'Failed to update child profile',
        childId
      });
    }

    // Return the newly added activity
    res.status(201).json({
      message: 'Activity added successfully',
      activity: newActivity
    });
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({
      message: 'Error adding activity',
      error: error.message,
      stack: error.stack
    });
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

// genrates monthly summary and add to child Journal
exports.generateMonthlySummary = async (req, res) => {
  try {
    const { childId, month, year } = req.query;
    if (!childId || !month || !year) {
      return res.status(400).json({ error: "Child ID, month, and year are required." });
    }
    const { summary, addedToS3, error } = await geminiService.generateMonthlySummary(req.query)
    if (error) {
      return res.status(400).json({ error });
    }

    if (!addedToS3) {
      summaryBody = {
        "month": month,
        "year": year,
        "childId": childId,
        "summary": summary,
      }
      const { success, url } = await uploadSummaryToS3(summary, childId, month, year);
      if (!success) {
        return res.status(500).json({ error: "Failed to upload summary to S3" });
      }
      await ChildJournal.findOneAndUpdate(
        { childId },
        { $set: { document: url } },
        { upsert: true, new: true }
      );
      const addedSummary = new MonthlySummary(summaryBody)
      await addedSummary.save();
    }

    return res.status(200).json({ summary });
  } catch (error) {
    console.error("Error generating monthly summary:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to generate monthly summary" });
  }
};