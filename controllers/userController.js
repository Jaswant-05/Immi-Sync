const { updateUserService } = require("../services/userService");

const updateUser  = async(req,res) => {
    try {
        const userId = req.userId;
        const updatedUser = await updateUserService({ userId, ...req.body });
        res.json(updatedUser);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
};

module.exports = {
    updateUser
}