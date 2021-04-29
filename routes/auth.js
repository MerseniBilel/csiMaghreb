const route = require('express').Router();
const {check, validationResult} = require('express-validator');
const User =  require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const dotenv = require('dotenv');
const auth = require('../middleware/auth');
dotenv.config();
KEY = process.env.KEY || 'pfepfe'; 




//@route    GET    api/auth
//@desc     auth   get authenticated user data
//@access          public
route.get('/', auth, async (req,res) =>{
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send('server error');
    }
});



// @route   POST    api/auth
// @desc    auth    authenticate user
// @access          public
route.post('/',[
    check('email','Please enter a valid email').isEmail(),
    check('password','Password is required').exists(),
],async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send({ errors : errors.array()});
    }
    const {email, password} = req.body; 
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).send({ errors:[ {msg:'Invalid credentials'} ] });
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if(!isMatched){
            return res.status(400).send({ errors:[ {msg:'Invalid credentials'} ] });
        }

        const payload = {
            user:{
                id: user.id,
                role: user.role
            }
        }

        jwt.sign(
            payload,
            KEY,
            {expiresIn:36000},
            (err, token)=>{
                if(err) throw err;
                res.send({token});
            }
        );

    }catch(err){
        console.log(err);
        res.status(500).send("server error");
    }

});

module.exports = route