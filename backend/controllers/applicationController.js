const ApplicationService = require("../services/applicationService");
const User = require("../models/User");

const createApplication = async (req, res) => {
  try {
    const userId = req.userId;
    const {
        consultancyId,
        applicant_name,
        applicant_email,
        application_type,
        application_status,
        tasks,
        documents,
    } = req.body;


    const payload = {
      user: userId,
      consultancy: consultancyId,
      applicant_name,
      applicant_email,
      application_type,
      application_status,
      tasks,
      documents,
    };

    const result = await ApplicationService.createApplication(payload);
    return res.status(201).json(result);

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const result = await ApplicationService.getApplication(applicationId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const {
      user,
      consultancy,
      application_type,
      application_status,
      applicant_email,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const filters = {
      user,
      consultancy,
      application_type,
      application_status,
      applicant_email,
      page: parseInt(page),
      limit: parseInt(limit),
      sort
    };

    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    const result = await ApplicationService.getAllApplications(filters);
    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const updates = req.body;

    const result = await ApplicationService.updateApplication(applicationId, updates);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const result = await ApplicationService.deleteApplicatioin(applicationId);

    return res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createApplication,
  getApplication,
  getAllApplications,
  updateApplication,
  deleteApplication,
};
