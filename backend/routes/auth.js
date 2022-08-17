const express=require('express');
const router=express.Router();
const User=require('../models/Users')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');

//Create a user using :POST "/api/auth". Doesn't require auth
const JWT_SECRET="Harshreactproject"

router.post('/createuser',[
    body('email').isEmail(),
  
  body('password').isLength({ min: 5 }),
  body('name').isLength({ min: 3 }),
],async (req,res)=>{
  //Error Handling 
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //
    try{
    
      const salt=await bcrypt.genSalt(10);
     const secPass=await bcrypt.hash( req.body.password,salt);
    let user=await User.create({
        name: req.body.name,
        password: secPass,
        email:req.body.email
      })
      const data={
        user:{
          id:user.id
        }
      }
      const authToken=jwt.sign(data,JWT_SECRET);
      // console.log(authToken);
      res.json({authToken});
    }
    catch(err){
      res.status(400).json(err.message);
      console.error(err)
    }
    //   .then(user => res.json(user))
    //   .catch(err=>{console.log(err)
    // res.json({error:"Please enter unique email",msg:err.message})
    
    });



module.exports=router;