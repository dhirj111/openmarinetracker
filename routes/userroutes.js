const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/usercontroller');

router.post('/register',  usercontroller.register);
router.get('/login' , usercontroller.login)
module.exports = router;