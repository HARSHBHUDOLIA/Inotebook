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
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
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
         const authToken = jwt.sign(data, JWT_SECRET)
         // console.log(authToken);
         res.json({ authToken })
      } catch (err) {
         res.status(400).json(err.message)
         console.error(err)
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
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }
   const {email,password}=req.body;
   try {
     let user=await User.findOne({email});
     if(!user){
      res.status(400).json({error:"Please Enter Correct Credentials"})
     }
     const passwordCompare=await bcrypt.compare(password,user.password);
     if(!passwordCompare){
      res.status(400).json({error:"Please Enter Correct Credentials"})
     }
     const data = {
      user: {
         id: user.id,
      },
       }
       const authToken = jwt.sign(data, JWT_SECRET)
      
       res.json({ authToken })
   } catch (error) {
    res.status(400).json("Some Internal Error Occured")
         console.error(error)
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
   const {email,password}=req.body;
   try {
    let userId=req.user.id;
    let user=User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    res.status(400).json("Some Internal Error Occured")
    console.error(error)
  }
})

module.exports = router
