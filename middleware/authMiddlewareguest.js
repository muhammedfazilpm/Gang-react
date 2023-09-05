
const jwt=require("jsonwebtoken")
 
module.exports= async (req,res,next)=>{
   
   try {
    
    const guesttoken=req.headers['authorization'].split(" ")[1];
   
   jwt.verify(guesttoken,process.env.JWT_SECRET,(err,decoded)=>{
    
    if(err){
     
        return res.staus(401).send({
            message:"Auth failed",
            success:false
        })  
    }else{
        req.body.guest=decoded.id 
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
