const mongoose=require('mongoose')
const ratingSchema=mongoose.Schema({
    guideid:{
        type:String,
        required:true
    },
    guestid:{
        type:String,
        required:true
    },
    guestname:{
        type:String,
        required:true
    },
    review:{
        type:String,
        require:true
    },
    rating:{
        type:Number,
        required:true
    },
    average:{
        type:String,
    
    }
},{
    timestamps:true
    
})

const ratingModel=mongoose.model("rating",ratingSchema)
module.exports=ratingModel