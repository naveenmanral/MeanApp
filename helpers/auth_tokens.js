const jwt = require('jsonwebtoken');

const accessToken = (userID)=>{
     
    return new Promise((resolve,reject) => {
                
    const payload = {
                        subject:userID
                    };

    const SECRET_KEY = process.env.ACCESS_TOKEN_SECRETKEY;

    const options = {
                        expiresIn:'1h',
                        issuer:'MedicalFacilitator_Ezziane'
                    }

    const token  = jwt.sign(payload, SECRET_KEY, options,(err,token)=>{

                        if(err) {
                                    reject(err);
                                    return;
                                }
                            resolve(token);
                    });

    });
}

const refreshToken = (userID)=>{
     
    return new Promise((resolve,reject) => {
                
    const payload = {
                        subject:userID
                    };

    const SECRET_KEY = process.env.REFRESH_TOKEN_SECRETKEY;

    const options = {
                        expiresIn:'1y',
                        issuer:'MedicalFacilitator_Ezziane'
                    }

    const token  = jwt.sign(payload, SECRET_KEY, options,(err,token)=>{

                        if(err) {
                                    reject(err);
                                    return;
                                }
                            resolve(token);
                    });

    });
}

const verifyToken = (req,res,next)=>{
    
    if(!req.headers.authorization){        
      return res.status(401).send('Unauthorised Request');
    }
    let token = req.headers.authorization.split(' ')[1];
   
    if (!token){
      return res.status(401).send('Unauthorised Request');
    }
    try {
        const SECRET_KEY = process.env.ACCESS_TOKEN_SECRETKEY;
        let payload = jwt.verify(token,SECRET_KEY);    
    // if (!payload){
    //   return res.status(401).send('Unauthorised Request');
    // }
        req._id = payload.subject;
        //console.log(req._id);
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).send('Unauthorised Request')
    }
    
    }

module.exports = {accessToken, refreshToken , verifyToken};