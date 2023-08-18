const mongoose=require('mongoose')

const guideDetailsSchema=mongoose.Schema({
   name:{
      type:String,
      required:true
   },

   guidid:{
      type:String,
      required:true
   },
    
   idnumber:{
    type:String,
    required:true
   },
   idimage:{
    type:String,
    default:'https://res.cloudinary.com/dft5pexxb/image/upload/v1691580638/rbdeej2jzbnr89m6clcd.jpg',
    required:true
   },
   location:{
    type:String,
    required:true
   },
   description:{
      type:String
   },
   amount:{
      type:Number,
      required:true
   },
   advance:{
      type:Number,
      required:true
   }
   
})

const guideDetailsModel=mongoose.model('guidedetails',guideDetailsSchema)
module.exports=guideDetailsModel