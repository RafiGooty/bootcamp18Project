const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>{

  try{
    const token=req.headers.authorization.split(" ")[1];
    let decodeData=jwt.verify( token, "secret_this_code_from_gooty");
    req.UserObjectID=decodeData.userId;
    next();
  } catch(error){
    res.status(401).json({ message:"Auth Failed Gooty"})
  }
}
