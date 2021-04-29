const router = require("express").Router();
const {check, validationResult} = require('express-validator');
const User =  require('../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const dotenv = require('dotenv');
dotenv.config();
KEY = process.env.KEY || 'pfepfe'; 

// @route GET   api/users
// @desc        Test router
// @access      Public
router.get('/',(req,res) => {
    res.send('this is user router');
});




// @route   POST    api/users
// @desc    add     add new user
// @access          Public          
router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('lastname','lastname is required').not().isEmpty(),
    check('role','role is required').not().isEmpty(),
    check('phone_number','phone number is required').not().isEmpty(),
    check('email','Please enter a valid email').isEmail(),
    check('password','Password must be 6 or more characters').isLength({ min:6 }),
], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send({ errors : errors.array()});
    }

    const {name,lastname,phone_number, role, email, password} = req.body; 

    try{
        //check if user exists
        let user = await User.findOne({email});
        if(user){
           return res.status(400).send({ errors:[ {msg:'User already exists'} ] });
        }


        // get user avatar from email 
        const avatar = gravatar.url(email, {
            s:'200',
            r:'pg',
            d:'mm'
        });

        //create a new user 
        user = new User({
            name,
            lastname,
            email,
            phone_number,
            role,
            password,
            avatar
        });

        //hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);

        //save user into db
        try {
            await user.save();
            res.send({user});
        } catch (error) {
            return res.status(500).send("server error");
        }



    }catch(err){
        console.log(err);
        res.status(500).send("server error");
    }

});

module.exports = router;