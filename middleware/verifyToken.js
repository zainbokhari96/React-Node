//  Import JWT For Checking Login Token
const jwt = require("jsonwebtoken");
// Private Key Must Be Save In ENV Files Not Here , Must Read From ENV Files In Production
const privateKey = "ZainPrivateKeyForTesting";

const verifyToken = (req,res,next) => {
    // Get the user from JWT token and user id to req object
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error:'Please Authenticate Using a Valid Token'})
    }
    try {
        let verifyToken = jwt.verify(token,privateKey);
        req.user = verifyToken;
        next();
    } catch (error) {
        res.status(401).send({error:'Please Authenticate Using a Valid Token'})
    }
}

module.exports = verifyToken