const { updateUserService, removeUser, getUserInfo } = require("../services/userService");

const getInfo = async(req,res) => {
  try{
    const userId = req.userId;
    const result = await getUserInfo(userId); 
  
    if(result.success){
      res.json({success: true, user: result.user});
    }
  } catch(err) {
    res.status(400).json({error : err.message});
  } 
};

const updateUser = async(req,res) => {
    try {
        const userId = req.userId;
        const updatedUser = await updateUserService({ userId, ...req.body });
        res.json(updatedUser);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
};

const deleteUser = async(req, res) => {
  try {
    const userId = req.userId;
    await removeUser(userId);
    res.json({ message: "Delete Account for User"});
  } catch(err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  updateUser,
  deleteUser,
  getInfo,
}