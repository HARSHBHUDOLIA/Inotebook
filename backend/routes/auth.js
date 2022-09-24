const express = require("express")
const router = express.Router()
const User = require("../models/Users")
const { body, validationResult } = require("express-validator")
const bcrypt = require("bcrypt")
const fetchuser=require("../middleware/fetchuser")
const jwt = require("jsonwebtoken")

//ROUTE 1: Create a user using :POST "/api/auth/createuser". Doesn't require auth(no login required)
const JWT_SECRET = "Harshreactproject"

router.post(
   "/createuser",
   [
      body("email").isEmail(),

      body("password").isLength({ min: 5 }),
      body("name").isLength({ min: 3 }),
   ],
   async (req, res) => {
      //Error Handling
      let success=false;
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         return res.status(400).json({success, errors: errors.array() })
      }
      //
      try {
         const salt = await bcrypt.genSalt(10)
         const secPass = await bcrypt.hash(req.body.password, salt)
         let user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
         })
         const data = {
            user: {
               id: user.id,
            },
         }
         const authtoken = jwt.sign(data, JWT_SECRET)
         // console.log(authToken);
         success=true
         res.json({success ,authtoken })
      } catch (err) {
         return res.status(400).json(err.message)
         
      }
      //   .then(user => res.json(user))
      //   .catch(err=>{console.log(err)
      // res.json({error:"Please enter unique email",msg:err.message})
   }
)

//ROUTE 2: Login a user using :POST "/api/auth/login". Doesn't require auth(no login required)
router.post("/login", [
  body("email").isEmail(),
  body("password","Password Cannot Be Blank").exists()
], async (req, res) => {
   //Error Handling
   let success=false;
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() })
   }
   const {email,password}=req.body;
   try {
     let user=await User.findOne({email});
     if(!user){
     return res.status(400).json({error:"Please Enter Correct Credentials"})
     }
     const passwordCompare=await bcrypt.compare(password,user.password);
     if(!passwordCompare){
      success=false
     return res.status(400).json({success,error:"Please Enter Correct Credentials"})
     
     }
     const data = {
      user: {
         id: user.id,
      },
       }
       const authtoken = jwt.sign(data, JWT_SECRET)
      
      success=true;
      return res.json({success ,authtoken })
   } catch (error) {
   return  res.status(400).json("Some Internal Error Occured")
      
   }
})
//ROUTE 2: GET Looged in User Details :POST "/api/auth/getuser". login required
router.post("/getuser",fetchuser,
 async (req, res) => {
   //Error Handling
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }
   
   try {
    let userId=req.user.id;
    let user=User.findById(userId).select("-password")
   return res.send(user)
  } catch (error) {
   return res.status(400).json("Some Internal Error Occured")
    
  }
})

module.exports = router
