const mongoose=require("mongoose")

const locationSchema=mongoose.Schema({
    state:{
        type:String,
        required:true
    },
    district:{
       type:Array,
       required:true
    }
})

const locationModel=mongoose.model("location",locationSchema)
module.exports=locationModel