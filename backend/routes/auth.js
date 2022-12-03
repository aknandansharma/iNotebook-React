const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");


const JWT_SECRET = 'Aknandanisagoodb$oy';





// Route-1-: Create a User using: POSt "/api/auth/createuser". No login required.
router.post(
  "/createuser",
  [
    body("name", "Enter vaild name").isLength({ min: 3 }),
    body("email", "Enter vaild email").isEmail(),
    body("password", "Enter vaild password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // if there are no error, return bad request and the errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    
    try {
      // Check whether the user with this  email exists already.
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists." });
      }

      // Hashing the passwords.

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // Create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      // Sending the data usig JWT.
      const data = {
        user:{
           id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
     
      // res.json({ user });
      res.json({ authtoken });

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error ocurred.");
    }
  }
);



// Route-2-: Authenticate a User using: POST "/api/auth/login". No login required.
router.post(
  "/login",
  [
    body("email", "Enter vaild email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    // if there are no error, return bad request and the errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // Check whether the user with this  email exists already.

      let user = await User.findOne({ email});
      if(!user){
        return res.status(400).json({error: "Try to login correct login id"});
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
        return res.status(400).json({ error: "Try to login correct login id" }); 
      }

      const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);

      // res.json({ user });
      res.json({ authtoken });

    }catch (error) {
      console.error(error.message);
      res.status(500).send("Intenral server Error");
    }



  }
);


module.exports = router;
