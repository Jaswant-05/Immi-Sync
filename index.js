const express = require('express');
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>{
        res.status(200).json({
            message : "Reached Here Successfully"
        });
});

app.listen(PORT, () =>{
    console.log(`App listenting on port ${PORT}`);
});