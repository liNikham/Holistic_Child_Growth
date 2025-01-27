const Child = require("../models/child.model");
const DailyCapture = require("../models/dailyCapture.model");
const capturedData = async (req, res) => {
    try {
        if(!req.query.childId || !req.query.date){
            return res.status(400).json({status:false,message:"ChildId and Date is required"});
        }
        const child = await Child.findById(req.query.childId);
        if(!child){
            return res.status(404).json({status:false,message:"Child not found"});
        }
        const date = req.query.date;
        const currentCapture = await DailyCapture.findOne({childId: req.query.childId, date: date});
        if(!dailyCapture){
            return res.status(404).json({status:false,message:"No data found for the given date"});
        }

        return res.status(200).json({status:true, data:currentCapture.details});
        
    } catch (error) {
        return res.status(500).json({status:false,message: error.message});
    }
}

const captureData = async (req, res) => {
    try {
        if(!req.query.childId || !req.query.date || !req.body.time || !req.body.capturedData){
            return res.status(400).json({status:false,message:"ChildId, Date, Time and Captured Data is required"});
        }
        const child = await Child.findById(req.query.childId);
        if(!child){
            return res.status(404).json({status:false,message:"Child not found"});
        }
        const date = req.query.date;
        const currentCapture = await DailyCapture.findOne({childId: req.query.childId, date: date});
        if(!currentCapture){
            const newCapture = new DailyCapture({
                childId: req.query.childId,
                date: req.query.date,
                details: {
                    time: req.body.time,
                    capturedData: req.body.capturedData
                }
            });
            await newCapture.save();
            return res.status(201).json({status:true, message:"Data captured successfully"});
        }

        currentCapture.details.push({
            time: req.body.time,
            capturedData: req.body.capturedData
        });
        await currentCapture.save();
        return res.status(201).json({status:true, message:"Data captured successfully"});
        
    } catch (error) {
        return res.status(500).json({status:false,message: error.message});
    }
}

const updateCapturedData = async (req, res) => {
    try {
        if( !req.body.capturedData || req.query.capturedId || !req.query.childId || !req.body.time){
            return res.status(400).json({status:false,message:"ChildId, Date and Time is required"});
        }
        const child = await Child.findById(req.query.childId);
        if(!child){
            return res.status(404).json({status:false,message:"Child not found"});
        }
        const currentCapture = await DailyCapture.findById(capturedId);
        if(!currentCapture){
            return res.status(404).json({status:false,message:"No data found for the given date"});
        }
        const time = req.body.time;
        const index = currentCapture.details.findIndex(detail => detail.time === time);
        if(index === -1){
            return res.status(404).json({status:false,message:"No data found for the given time"});
        }
        currentCapture.details[index].capturedData = req.body.capturedData;
        await currentCapture.save();
        return res.status(200).json({status:true, message:"Data modified successfully", data:currentCapture.details[index]});
        
    } catch (error) {
        return res.status(500).json({status:false,message: error.message});
    }
}

module.exports = {
    capturedData,
    captureData,
    updateCapturedData
}