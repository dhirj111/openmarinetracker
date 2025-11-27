const express = require('express');
const router = express.Router();
const shipcontroller = require('../controllers/shipcontroller');
const auth = require('../middleware/auth');

router.get('/ships' , shipcontroller.getallships) 
//public  @Fetch a list of all Ships with details such as date time ship name .

router.get('/ship/:id' , shipcontroller.getshipbyid)   //public GET /ships/{id} – Fetch a specific ship by id.

router.post('/ship' , auth ,shipcontroller.newship)   //private   add new ship to db

router.put('/ship/:id', auth ,shipcontroller.updateship) //private update ship in db by id

router.delete('/ship/:id',auth , shipcontroller.deleteship)    //private delete ship by id

module.exports = router;