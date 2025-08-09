const Consultancy = require("../models/Consultancy");
const { removeConsultancy, getUsers, updateConsultancy, getApplication, getAllConsultancies } = require("../services/consultancyService.js");

const getConsultanacyInfo = async(req, res) => {
    try {
        const userId = req.userId;
        const consultancy = await Consultancy.findOne({ admin: userId }).populate('users').populate('address');
        
        if (!consultancy) {
            return res.status(404).json({ error: "Consultancy not found" });
        }
        
        res.json(consultancy);
    } catch(err) {
        res.status(400).json({ error: err.message });
    }
}

const getAllConsultanciesController = async (req, res) => {
  try {
    const {
      user,
      application,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    console.log("reached here")
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const filters = {
      user,
      application,
      page: parseInt(page),
      limit: parseInt(limit),
      sort
    };

    Object.keys(filters).forEach((key) => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    const result = await getAllConsultancies(filters);
    console.log(result);
    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


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
    getApplications,
    getAllConsultanciesController
}