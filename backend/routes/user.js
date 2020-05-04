const express=require('express');
const User =require('../models/user');
const router=express.Router();
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');
const userController=require('../controllers/user')

router.post("/signup",userController.createUser);
router.post("/login",userController.userLogin);

module.exports=router;
