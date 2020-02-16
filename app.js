const express = require("express");
const rentOlx = require('./Controllers/RentOlx')
var app = express();

app.use(express.json());
app.get("/rent", rentOlx);
app.get("/", (req,res) => {res.send('oi')});

app.listen(3000);
