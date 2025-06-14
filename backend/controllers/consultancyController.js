const Consultancy = require("../models/Consultancy");
const { removeConsultancy, getUsers, updateConsultancy } = require("../services/consultancyService");

const getConsultancyUsers = async(req,res) => {
    try {
        const userId = req.userId;
        const consultancy = await Consultancy.findOne({admin : userId});
        const result = await getUsers(consultancy._id);
        if(result.success){
            res,json(result.users);
        }
    } catch(err) {
        res.status(400).json({ error : err.message });
    }
}

const updateConsultancyInfo = async(req, res) => {
    try {
        const userId = req.userId;
        const consultancy = await Consultancy.findOne({admin : userId});
        const result = await updateConsultancy(consultancy._id, ...req.body)
        if(result.success){
            res.json(result.consultancy);
        }
    } catch(err) {
        res.status(400).json({ error : err.message });
    }
}

const deleteConsultancy = async(req, res) => {
    try{
        const userId = req.userId;
        const consultancy = await Consultancy.findOne({admin : userId});
        const result = await removeConsultancy(consultancy._id);
        if(result.success){
            res.json({success: true, message: "Unpublished Consultancy"});
        }
    } catch(err){
        res.status(400).json({error : err.message});
    }
}

module.exports = {
    deleteConsultancy,
    getConsultancyUsers,
    updateConsultancyInfo
}