const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/usercontroller');

router.post('/register',  usercontroller.register);
module.exports = router;