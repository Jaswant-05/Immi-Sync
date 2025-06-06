const { removeConsultancy, getUsers, updateConsultancy } = require("../services/consultancyService");

const getConsultancyUsers = async(req,res) => {
    try {
        const consultancyId = req.userId;
        const result = await getUsers(consultancyId);
        if(result.success){
            res,json(result.users);
        }
    } catch(err) {
        res.status(400).json({ error : err.message });
    }
}

const updateConsultancyInfo = async(req, res) => {
    try {
        const consultancyId = req.consultancyId;
        const result = await updateConsultancy(consultancyId, ...req.body)
        if(result.success){
            res.json(result.consultancy);
        }
    } catch(err) {
        res.status(400).json({ error : err.message });
    }
}

const deleteConsultancy = async(req, res) => {
    try{
        const consultancyId = req.consultancyId;
        const result = await removeConsultancy(consultancyId);
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