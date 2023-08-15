const mongoose=require("mongoose")

const guideSchema= mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isVerfied:{
        type:Boolean,
        default:false
    },
    otp:{
        type:Number,
       
    },
    profile:{
        type:String,
        default:"https://res.cloudinary.com/dft5pexxb/image/upload/v1691580638/rbdeej2jzbnr89m6clcd.jpg"
    },
    location:{
        type:String,
        default:""
    },
    isAdminverified:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true,
})

const guideModel=mongoose.model("guide",guideSchema)

module.exports=guideModel