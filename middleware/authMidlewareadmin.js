const { error } = require("console")
const jwt=require("jsonwebtoken")
 
module.exports= async (req,res,next)=>{
   
   try {
   
    const admintoken=req.headers['authorization'].split(" ")[1];
    
   jwt.verify(admintoken,process.env.JWT_SECRET,(err,decoded)=>{
    
    if(err){
     
        return res.staus(401).send({
            message:"Auth failed",
            success:false
        })  
    }else{
        req.body.admin=decoded.id 
        next();
    }

   
   })
   } catch (error) {
    
    return res.status(401).send({
        message:"Auth failed it",
        success:false
    })  
    
   }
}
