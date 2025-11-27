require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose')
const path = require('path');
const app = express();
app.use(express.json());



const userroute = require('./routes/userroutes');

app.use('/api/user', userroute);


const uri = process.env.MONGO_URI;
const PORT = process.env.PORT || 8085;
mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));



// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});


