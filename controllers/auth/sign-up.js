const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const { createConsultancy } = require('../../helpers/consultancy/create-consultancy');


const signUp = async(req, res) => {
    const {username, password, role} = req.body;
    console.log(req.body);

    if(!username || !password || !role){
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
    };

    console.log("Creating user with the following Payload", userPayload);

    const newUser = await User.create(userPayload);
    if(!newUser){
        return res.status(400).json({
            message: "Failed to create a user"
        });
    };

   
    if(newUser.role === "consultancy"){
        //create a new consultancy here 
        const userId = newUser.id;
        const { name, address, phoneNumber } = req.body;

        if(!userId, !name, !address, !phoneNumber){
            res.status(404).json({
                message : "Inavalid Inputs"
            })
        };

        const newConsultancy = createConsultancy(userId ,name, address, phoneNumber);
        if(!newConsultancy){
            res.status(404).json({
                message : "Error creating New consultancy"
            })
        }
        newUser.consultancy = newConsultancy.id
        await newUser.save();

        res.status(200).json({
            newUser,
            message : "User created successfully"
        })

    }
    else if(newUser.role === "client"){
         //call the helper functions to assign consultancy here 
    }

    
    

}

module.exports = {
    signUp
}




//username, password, role name, address, phoneNumber