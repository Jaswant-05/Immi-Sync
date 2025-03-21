const express = require('express');
const { connectDB } = require('./db');
const cors = require("cors");
const userRouter = require('./routes/user')
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) =>{
        res.status(200).json({
            message : "Reached Here Successfully"
        });
});

app.use("/api/v1/user", userRouter);

app.listen(PORT, () =>{
    console.log(`App listenting on port ${PORT}`);
});