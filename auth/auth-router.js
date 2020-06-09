const bcryptjs = require('bcryptjs');

const router = require('express').Router();
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets.js");

const Users = require('../users/user-model.js');
const {isValid} = require('../users/user-service.js');

router.post('/register',(req,res)=>{
    const credentials = req.body;

    if(isValid(credentials)) {
        const rounds = process.env.BCRYPT_ROUNDS || 8;

        const hash = bcryptjs.hashSync(credentials.password,rounds);

        credentials.password = hash;

        Users.add(credentials)
        .then(user=>{
            res.status(201).json({data:user})
        })
        .catch(error=>{
            console.log(error)
            res.status(500).json({message:"database error"})
        })
    }
})

router.post("/login",(req,res)=>{
    const {username,password} = req.body;

    if(isValid(req.body)) {
        Users.findBy({username: username})
        .then(([user])=>{
            if(user && bcryptjs.compareSync(password, user.password)){
                const token = generateToken(user)
                res.status(200).json({
                    message:"Welcom to the API",
                    token
                })
            } else {
                res.status(401).json({message: "invalid credentials"})
            }
        })
        .catch(error=>{

            console.log('error in auth-router, /login', error)
            res.status(500).json({message:'database error'})
        })
    }
    else {
        res.status(400).json({
            message:"please provide username and password!"
        })
    }
})

function generateToken(user){
    const payload = {
        subject: user.id,
        username: user.username,
        department: user.department
    };
    const options = {
        expiresIn: "2h"
    }
    return jwt.sign(payload, secrets.jwtSecret, options)
}


module.exports = router