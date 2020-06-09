const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js')

module.exports = (req,res,next)=>{
    const token = req.headers.authorization

    // const [directive, token] = req.headers.authorization.split(' ')[1];

    // const tokenHeader = req.headers.authorization
    // const parts = tokenHeader.split('');
    // const bearerTypeDirective = parts[0];
    // const token = parts[1]


    if(token){
        jwt.verify(token, secrets.jwtSecret, (err,decodedToken)=>{
            if(err) {
                console.log(token)
                res.status(401).json({you:"token denied"})
            } else {
                req.decodedJwt = decodedToken;
                console.log(decodedToken);
                next()
            }
        })
    } else{
        console.log(req.headers)
        res.status(401).json({message:"you lack a token"})
    }
}

