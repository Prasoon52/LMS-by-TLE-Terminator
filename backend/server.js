const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
//import connectDb from "./configs/db.js"
//import dotenv from "dotenv"
app.use(cors()); 
app.use(express.json());
//dotenv.config()

let users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
];



app.get('/api/users', (req, res) => {
    res.json(users); 
});


app.listen(port, () => {
    //connectDb();
    console.log(`Server running at http://localhost:${port}`);
});