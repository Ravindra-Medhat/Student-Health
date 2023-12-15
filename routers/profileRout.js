const express = require('express')
const app = express()
const user = require("../models/Users");

app.get('/', async (req, res) => {
    try {
      const userId = req.data._id;   
      const User = await user.findById(userId);

      res.render('profile', {
        userEmail: User.Email,
        Name: User.Name,
        mobileNumber: User.MobileNumber,
    });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = app;