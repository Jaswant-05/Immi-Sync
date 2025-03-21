const bcrypt = require('bcryptjs');
const User = require('../../models/User');

const signUp = async(req, res) => {
    const {username, password, role, consultancy_id, application_type} = req.body;

    if(!username || !password || !role || !consultancy_id || !application_type){
        return res.status(404).json({
            message: "Invalid Parameters"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if(!hashedPassword){
        return res.status(400).json({
            message: "Unable to Hash Password"
        });
    }

    const existingUser = await User.findOne({username});
    if(existingUser){
        return res.status(409).json({
            message: "User with email already exists"
        });
    }

    const userPayload = {
        username: username,
        password: hashedPassword,
        role: role,
        consultancy: consultancy_id,
        application_type: application_type,
        application_status : 'Draft'
    };

    console.log("Creating user with the following Payload", userPayload);

    const newUser = await User.create(userPayload);
    if(!newUser){
        return res.status(400).json({
            message: "Failed to create a user"
        });
    };
    
    res.status(200).json({
        newUser,
        message : "User created successfully"
    })


}

module.exports = {
    signUp
}


