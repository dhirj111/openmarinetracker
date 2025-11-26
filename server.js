const express = require('express');
const path = require('path');
const app = express();
const PORT = 8085
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});