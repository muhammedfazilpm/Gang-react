const { error } = require("console")
const jwt=require("jsonwebtoken")
 
module.exports= async (req,res,next)=>{
   
   try {
   
    const token=req.headers['authorization'].split(" ")[1];
    
   jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
    
    if(err){
     
        return res.staus(401).send({
            message:"Auth failed",
            success:false
        })  
    }else{
        req.body.guide=decoded.id 
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
