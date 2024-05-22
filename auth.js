const jwt=require('jsonwebtoken');

const authMiddle=async(req,res,next)=>{
    const authHead=req.headers.authorization;

    if(!authHead || !authHead.startsWith('Bearer ')){
        throw new UnAuthorized('Please Provide valid Token');
    }

    const token=authHead.split(' ')[1];

    try {
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        const{id,username}=decode;
        req.user={id,username}
        next();
    } catch (error) {
        throw new UnAuthorized('Authentication failed');
    }
  
}

module.exports=authMiddle;