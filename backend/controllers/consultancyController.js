const Consultancy = require("../models/Consultancy");
const { removeConsultancy, getUsers, updateConsultancy, getApplication } = require("../services/consultancyService.js");

const getConsultanacyInfo = async(req, res) => {
    try {
        const userId = req.userId;
        const consultancy = await Consultancy.findOne({ admin: userId }).populate('users').populate('address');
        
        console.log(consultancy);
        if (!consultancy) {
            return res.status(404).json({ error: "Consultancy not found" });
        }
        
        res.json(consultancy);
    } catch(err) {
        res.status(400).json({ error: err.message });
    }
}

const getConsultancyUsers = async(req, res) => {
    try {
        const userId = req.userId;
        const consultancy = await Consultancy.findOne({ admin: userId });
        
        if (!consultancy) {
            return res.status(404).json({ error: "Consultancy not found" });
        }
        
        const result = await getUsers(consultancy._id);
        
        if (result.success) {
            res.json(result.users); 
        } else {
            res.status(400).json({ error: result.error || "Failed to get users" });
        }
    } catch(err) {
        res.status(400).json({ error: err.message });
    }
}

const updateConsultancyInfo = async(req, res) => {
    try {
        const userId = req.userId;
        const consultancy = await Consultancy.findOne({ admin: userId });
        
        if (!consultancy) {
            return res.status(404).json({ error: "Consultancy not found" });
        }
        
       const result = await updateConsultancy({ consultancyId: consultancy._id, ...req.body });
        
        if (result.success) {
            res.json(result.consultancy);
        } else {
            res.status(400).json({ error: result.error || "Failed to update consultancy" });
        }
    } catch(err) {
        res.status(400).json({ error: err.message });
    }
}

const deleteConsultancy = async(req, res) => {
    try {
        const userId = req.userId;
        const consultancy = await Consultancy.findOne({ admin: userId });
        
        if (!consultancy) {
            return res.status(404).json({ error: "Consultancy not found" });
        }
        
        const result = await removeConsultancy(consultancy._id);
        
        if (result.success) {
            res.json({ success: true, message: "Unpublished Consultancy" });
        } else {
            res.status(400).json({ error: result.error || "Failed to delete consultancy" });
        }
    } catch(err) {
        res.status(400).json({ error: err.message });
    }
}

const getApplications = async(req, res) => {
    try {
        const userId = req.userId;
        const consultancy = await Consultancy.findOne({ admin: userId });
        
        if (!consultancy) {
            return res.status(404).json({ error: "Consultancy not found" });
        }
        
        const result = await getApplication(consultancy._id);
        
        if (result.success) {
            res.json(result.applications);
        } else {
            res.status(400).json({ error: result.error || "Failed to get applications" });
        }
    } catch(err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    getConsultanacyInfo,
    deleteConsultancy,
    getConsultancyUsers,
    updateConsultancyInfo,
    getApplications
}