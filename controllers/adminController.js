const Consultancy = require('../models/Consultancy');

exports.getAllConsultancies = async (req, res) => {
  try {
    const consultancies = await Consultancy.find();
    return res.status(200).json(consultancies);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.approveConsultancy = async (req, res) => {
  try {
    const { id } = req.params;
    const consultancy = await Consultancy.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );

    if (!consultancy) {
      return res.status(404).json({ message: 'Consultancy not found' });
    }

    return res.status(200).json({ message: 'Consultancy approved', consultancy });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
