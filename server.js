const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
const PORT = 8085


const userroute = require('./routes/userroutes');

app.use('/api/user', userroute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});


