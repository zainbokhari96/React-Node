const express = require('express');
const User = require('../models/Users')
const router = express.Router();

// Signup Route For User , Doesnot Require Auth
router.post('/signup',(req,res) => {
    const user = User(req.body);
    user.save()
    res.json(req.body)
})

module.exports = router