const mongoose=require('mongoose')
const guestbannerSchema=mongoose.Schema({
    heading:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
})

const guestbannerModel=mongoose.model("guestbanner",guestbannerSchema)
module.exports=guestbannerModel