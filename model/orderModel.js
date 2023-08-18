const mongoose=require('mongoose')
const ordeSchema =mongoose.Schema({
    guestid:{
        type:String,
        required:true
    },
    guideid:{
        type:String,
        required:true
    },
    guide:{
        type:String,
        required:true
    },
    guest:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    dateofbook:{
        type:Date,
        required:true
    },
    amount:{
        type:Number,
        default:0
    },
    advance:{
        type:Number,
        default:0
    },
    numberofguest:{
        type:Number,
        required:true
    },
    paymentstatus:{
        type:String,
        default:'pending'

    },
    paymentid:{
        type:String,
        default:0
     },
},{
    timestamps:true
})

const orderModel=mongoose.model("oreder",ordeSchema)
module.exports=orderModel;